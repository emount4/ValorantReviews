import logging
from sqlalchemy.engine import Engine
from sqlalchemy import create_engine, text, MetaData, inspect
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional, Dict, List, Tuple, Any
from sqlalchemy import Table


class Connection:
    def __init__(self,
                 host: str = "localhost",
                 port: int = 5432,
                 dbname: str = "valorant_skins",
                 user: str = "postgres",
                 password: str = "postgre1234",
                 connect_timeout: int = 5,
                 sslmode: str = "prefer"):

        self.host = host
        self.port = port
        self.dbname = dbname
        self.user = user
        self.password = password
        self.connect_timeout = connect_timeout
        self.sslmode = sslmode
        self.metadata: Optional[MetaData] = None
        self.tables: Dict[str, Table] = {}
        self.engine: Optional[Engine] = None

    def connect(self) -> bool:
        try:
            url = (f"postgresql+psycopg2://{self.user}:{self.password}"
                   f"@{self.host}:{self.port}/{self.dbname}"
                   f"?sslmode={self.sslmode}&connect_timeout={self.connect_timeout}")

            self.engine = create_engine(url, future=True, pool_pre_ping=True)
            with self.engine.connect() as conn:
                conn.execute(text("SELECT 1"))

            # Инициализируем metadata после успешного подключения
            self.metadata = MetaData()
            self.metadata.reflect(bind=self.engine)

            print("Успешное подключение")
            return True
        except Exception as e:
            print("Ошибка подключения")
            self.engine = None
            return False

    def disconnect(self):
        if not self.engine:
            return False

        try:
            self.engine.dispose()
            self.engine = None
            self.tables = {}
            self.metadata = None
            return True
        except Exception as e:
            logging.error(f"Disconnect failed: {e}")
            return False

    def is_connected(self) -> bool:
        if not self.engine:
            return False

        try:
            with self.engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return True
        except Exception:
            return False

    def execute_query(self, query: str) -> List[Tuple]:
        """Выполнить SQL запрос и вернуть результаты"""
        if not self.is_connected():
            self.connect()

        try:
            with self.engine.connect() as conn:
                result = conn.execute(text(query))
                return result.fetchall()
        except Exception as e:
            logging.error(f"Query execution failed: {e}")
            return []

    def test_connection(self) -> Dict[str, Any]:
        """Протестировать подключение и получить базовую информацию"""
        if not self.connect():
            return {"status": "error", "message": "Connection failed"}

        try:
            # Базовая информация о БД
            version_result = self.execute_query("SELECT version()")[0][0]
            table_count = len(self.get_table_names())

            return {
                "status": "success",
                "database_version": version_result,
                "table_count": table_count,
                "table_names": self.get_table_names(),
                "connection_info": {
                    "host": self.host,
                    "port": self.port,
                    "database": self.dbname,
                    "user": self.user
                }
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def get_table_names(self) -> List[str]:
        """Получить список всех таблиц в базе данных"""
        if not self.is_connected():
            self.connect()

        if self.metadata:
            return list(self.metadata.tables.keys())
        return []

    def __enter__(self):
        if not self.is_connected():
            self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.disconnect()