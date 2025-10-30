import logging
from typing import List, Any, Dict

from sqlalchemy import inspect



class CRUD:
    def __init__(self, database):  # Принимаем экземпляр Database в конструкторе
        self.db = database

    def get_table_names(self) -> List[str]:
        """Получить список всех таблиц в базе данных"""
        if not self.db.is_connected():
            self.db.connect()

        if self.db.metadata:
            return list(self.db.metadata.tables.keys())
        return []

    def get_table_info(self, table_name: str) -> Dict[str, Any]:
        """Получить информацию о структуре таблицы"""
        if not self.db.is_connected():
            self.db.connect()

        try:
            inspector = inspect(self.db.engine)
            columns = inspector.get_columns(table_name)
            foreign_keys = inspector.get_foreign_keys(table_name)

            return {
                "columns": columns,
                "foreign_keys": foreign_keys,
                "primary_key": inspector.get_pk_constraint(table_name)
            }
        except Exception as e:
            logging.error(f"Error getting table info for {table_name}: {e}")
            return {}

    def test_connection(self) -> Dict[str, Any]:
        """Протестировать подключение и получить базовую информацию"""
        if not self.db.connect():
            return {"status": "error", "message": "Connection failed"}

        try:
            # Базовая информация о БД
            version_result = self.db.execute_query("SELECT version()")[0][0]
            table_count = len(self.get_table_names())

            return {
                "status": "success",
                "database_version": version_result,
                "table_count": table_count,
                "table_names": self.get_table_names(),
                "connection_info": {
                    "host": self.db.host,
                    "port": self.db.port,
                    "database": self.db.dbname,
                    "user": self.db.user
                }
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def get_table_schema(self, table_name: str) -> Dict[str, Any]:
        """Получить схему таблицы (названия и типы столбцов)"""
        if not self.db.is_connected():
            self.db.connect()
        try:
            inspector = inspect(self.db.engine)
            columns = inspector.get_columns(table_name)
            schema = {}
            for column in columns:
                schema[column['name']] = str(column['type'])
            return {
                "status": "success",
                "table_name": table_name,
                "schema": schema,
                "column_count": len(columns)
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def get_table_data(self, table_name: str, limit: int = 100) -> Dict[str, Any]:
        """Получить данные из таблицы (с ограничением по количеству строк)"""
        if not self.db.is_connected():
            self.db.connect()
        try:
            # Получаем схему таблицы для имен столбцов
            schema_info = self.get_table_schema(table_name)
            if schema_info["status"] != "success":
                return schema_info

            # Выполняем запрос для получения данных
            from sqlalchemy import Table, select

            table = Table(table_name, self.db.metadata, autoload_with=self.db.engine)
            stmt = select(table).limit(limit)

            with self.db.engine.begin() as connection:
                result = connection.execute(stmt)

            # Форматируем результат
            columns = list(schema_info["schema"].keys())
            data = []
            for row in result:
                row_dict = {}
                for i, column_name in enumerate(columns):
                    row_dict[column_name] = row[i]
                data.append(row_dict)

            return {
                "status": "success",
                "table_name": table_name,
                "columns": columns,
                "data": data,
                "row_count": len(data),
                "limit": limit
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def get_table_data_by_column (self, table_name: str, column: str, data, limit: int) -> Dict[str, Any]:
        if not self.db.is_connected():
            self.db.connect()

        try:
            schema_info = self.get_table_schema(table_name)
            if schema_info["status"] != "success":
                return schema_info

            if column not in schema_info["schema"].keys():
                return {
                    "status": "error",
                    "message": f"Column {column} is not in schema {schema_info['schema'].keys()}"
                }

            from sqlalchemy import Table, select
            table = Table(table_name, self.db.metadata, autoload_with=self.db.engine)

            stmt = select(table).where(table.c[column] == data).limit(limit)
            with self.db.engine.begin() as connection:
                result = connection.execute(stmt)
                rows = result.fetchall()

            if len(rows) == 0:
                return {"status": "error", "message": "Data not found"}

            columns = list(schema_info["schema"].keys())
            result_data = []
            for row in rows:
                row_dict = {}
                for i, column_name in enumerate(columns):
                    row_dict[column_name] = row[i]
                result_data.append(row_dict)

            return {
                "status": "success",
                "table_name": table_name,
                "column": column,
                "search_value": data,
                "columns": columns,
                "data": result_data,
                "row_count": len(result_data)
            }

        except Exception as e:
            return {"status": "error", "message": f"Select by column error{str(e)}"}

    def insert_data(self, table_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.db.is_connected():
            self.db.connect()
        try:
            schema_info = self.get_table_schema(table_name)
            if schema_info["status"] != "success":
                return {
                    "status": "error",
                    "message": f"Table '{table_name}' not found: {schema_info['message']}"
                }
            validation_result = self._validate_insert_data(table_name, data, schema_info["schema"])

            if validation_result["status"] == "error":
                return validation_result

            from sqlalchemy import Table, insert

            table = Table(table_name, self.db.metadata, autoload_with=self.db.engine)
            stmt = insert(table).values(data)

            with self.db.engine.begin() as connection:
                result = connection.execute(stmt)

            return {
                "status": "success",
                "message": f"Data inserted successfully into {table_name}",
                "inserted_id": result.inserted_primary_key[0] if result.inserted_primary_key else None,
                "rowcount": result.rowcount
            }
        except Exception as e:
            return {"status": "error", "message": f"Insert data error {str(e)}"}



    def _validate_insert_data(self, table_name: str, data: Dict[str, Any], schema: Dict[str, Any]) -> Dict[str, Any]:
        try:
            available_columns = list(schema.keys())

            for column_name in data.keys():
                if column_name not in available_columns:
                    return {
                        "status": "error",
                        "message": f"Column '{column_name}' does not exist in table '{table_name}'. Available columns: {available_columns}"
                    }

            #Добавить валидацию типов данных
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "message": f"validation error:{str(e)}"}