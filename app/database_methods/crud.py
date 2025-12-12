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

    def delete_data(self, table_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.db.is_connected():
            self.db.connect()
        try:
            schema_info = self.get_table_schema(table_name)
            if schema_info["status"] != "success":
                return {"status": "error", "message": f"Table {table_name} not found: {schema_info['message']}"}

            # Валидация данных для удаления
            available_columns = list(schema_info["schema"].keys())
            for column_name in data.keys():
                if column_name not in available_columns:
                    return {
                        "status": "error",
                        "message": f"Column '{column_name}' does not exist in table '{table_name}'. Available columns: {available_columns}"
                    }

            from sqlalchemy import Table, delete

            table = Table(table_name, self.db.metadata, autoload_with=self.db.engine)

            # Создаем условие WHERE для всех переданных пар ключ-значение
            where_conditions = []
            for column, value in data.items():
                where_conditions.append(table.c[column] == value)

            stmt = delete(table).where(*where_conditions)

            with self.db.engine.begin() as connection:
                result = connection.execute(stmt)

            if result.rowcount == 0:
                return {
                    "status": "error",
                    "message": "No rows found matching the criteria"
                }

            return {
                "status": "success",
                "message": f"Successfully deleted {result.rowcount} row(s) from {table_name}",
                "deleted_count": result.rowcount
            }

        except Exception as e:
            return {"status": "error", "message": f"Delete data error: {str(e)}"}

    def get_row_count(self, table_name: str, where_conditions: Dict[str, Any] = None) -> Dict[str, Any]:
        """Получить количество строк в таблице (с опциональными условиями)"""
        if not self.db.is_connected():
            self.db.connect()
        try:
            from sqlalchemy import Table, select, func

            table = Table(table_name, self.db.metadata, autoload_with=self.db.engine)

            # Базовый запрос COUNT(*)
            stmt = select(func.count()).select_from(table)

            # Добавляем условия WHERE если они есть
            if where_conditions:
                where_clauses = []
                for column, value in where_conditions.items():
                    where_clauses.append(table.c[column] == value)
                stmt = stmt.where(*where_clauses)

            with self.db.engine.begin() as connection:
                result = connection.execute(stmt)
                count = result.scalar()

            return {
                "status": "success",
                "table_name": table_name,
                "row_count": count,
                "has_conditions": where_conditions is not None,
                "conditions": where_conditions if where_conditions else "all rows"
            }

        except Exception as e:
            return {"status": "error", "message": f"Row count error: {str(e)}"}


    def get_column_values(self, table_name: str, column_name: str) -> Dict[str, Any]:
        """Получить все значения определенного столбца"""
        if not self.db.is_connected():
            self.db.connect()
        try:
            from sqlalchemy import Table, select, distinct

            table = Table(table_name, self.db.metadata, autoload_with=self.db.engine)
            stmt = select(table.c[column_name])

            with self.db.engine.begin() as connection:
                result = connection.execute(stmt)
                values = [row[0] for row in result]

            return {
                "status": "success",
                "data": values,
                "column": column_name,
                "table": table_name,
                "count": len(values)
            }
        except Exception as e:
            return {"status": "error", "message": f"Error getting column values: {str(e)}"}

    def get_table_data_by_filters(self, table_name: str, filters: Dict[str, Any], limit: int = 100) -> Dict[str, Any]:
        """Получить данные из таблицы с фильтрацией"""
        if not self.db.is_connected():
            self.db.connect()

        try:
            schema_info = self.get_table_schema(table_name)
            if schema_info["status"] != "success":
                return schema_info

            from sqlalchemy import Table, select

            table = Table(table_name, self.db.metadata, autoload_with=self.db.engine)
            stmt = select(table)

            # Добавляем условия WHERE
            where_conditions = []
            for column, value in filters.items():
                if column in schema_info["schema"]:
                    where_conditions.append(table.c[column] == value)

            if where_conditions:
                stmt = stmt.where(*where_conditions)

            stmt = stmt.limit(limit)

            with self.db.engine.begin() as connection:
                result = connection.execute(stmt)
                rows = result.fetchall()

            # Форматируем результат
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
                "filters": filters,
                "columns": columns,
                "data": result_data,
                "row_count": len(result_data),
                "limit": limit
            }

        except Exception as e:
            return {"status": "error", "message": f"Filter data error: {str(e)}"}

    def update_data(self, table_name: str, where_conditions: Dict[str, Any], update_data: Dict[str, Any]) -> Dict[
        str, Any]:
        """Обновить данные в таблице"""
        if not self.db.is_connected():
            self.db.connect()

        try:
            schema_info = self.get_table_schema(table_name)
            if schema_info["status"] != "success":
                return schema_info

            from sqlalchemy import Table, update

            table = Table(table_name, self.db.metadata, autoload_with=self.db.engine)

            # Создаем условие WHERE
            where_clauses = []
            for column, value in where_conditions.items():
                if column in schema_info["schema"]:
                    where_clauses.append(table.c[column] == value)

            if not where_clauses:
                return {"status": "error", "message": "No WHERE conditions provided"}

            stmt = update(table).where(*where_clauses).values(**update_data)

            with self.db.engine.begin() as connection:
                result = connection.execute(stmt)

            return {
                "status": "success",
                "message": f"Successfully updated {result.rowcount} row(s) in {table_name}",
                "rowcount": result.rowcount
            }

        except Exception as e:
            return {"status": "error", "message": f"Update data error: {str(e)}"}

    def get_table_data_paginated(self, table_name: str, page: int = 1, limit: int = 12,
                                 filters: Dict[str, Any] = None) -> Dict[str, Any]:
        """Получить данные из таблицы с пагинацией"""
        if not self.db.is_connected():
            self.db.connect()

        try:
            from sqlalchemy import Table, select, func

            table = Table(table_name, self.db.metadata, autoload_with=self.db.engine)

            # Вычисляем offset
            offset = (page - 1) * limit

            # Запрос для данных
            stmt = select(table)

            # Добавляем фильтры если есть
            if filters:
                where_conditions = []
                for column, value in filters.items():
                    if hasattr(table.c, column):
                        where_conditions.append(table.c[column].ilike(value))
                if where_conditions:
                    stmt = stmt.where(*where_conditions)

            # Применяем пагинацию
            stmt = stmt.offset(offset).limit(limit)

            # Запрос для общего количества
            count_stmt = select(func.count()).select_from(table)
            if filters:
                where_conditions = []
                for column, value in filters.items():
                    if hasattr(table.c, column):
                        where_conditions.append(table.c[column].ilike(value))
                if where_conditions:
                    count_stmt = count_stmt.where(*where_conditions)

            with self.db.engine.begin() as connection:
                # Получаем данные
                result = connection.execute(stmt)
                data = []
                for row in result:
                    data.append(dict(row._mapping))

                # Получаем общее количество
                total_count = connection.execute(count_stmt).scalar()

            has_more = (page * limit) < total_count

            return {
                "status": "success",
                "table_name": table_name,
                "data": data,
                "total": total_count,
                "page": page,
                "limit": limit,
                "has_more": has_more,
                "offset": offset
            }

        except Exception as e:
            return {"status": "error", "message": f"Paginated data error: {str(e)}"}