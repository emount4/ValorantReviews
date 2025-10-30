from sqlalchemy.orm import sessionmaker
from database_methods.connection import Connection
from database_methods.crud import CRUD

class Database(Connection):
    def __init__(self,
                 host: str = "localhost",
                 port: int = 5432,
                 dbname: str = "valorant_skins",
                 user: str = "postgres",
                 password: str = "postgre1234",
                 connect_timeout: int = 5):

        super().__init__(
            host=host,
            port=port,
            dbname=dbname,
            user=user,
            password=password,
            connect_timeout=connect_timeout
        )

# Создаем экземпляр базы данных
db = Database(
    host="localhost",
    port=5432,
    dbname="valorant_skins",
    user="postgres",
    password="postgre1234"
)

# Создаем экземпляр CRUD
crud = CRUD(db)

# Используем engine для создания сессии
if db.is_connected():
    SessionLocal = sessionmaker(bind=db.engine, autocommit=False, autoflush=False)
else:
    # Fallback подключение
    DATABASE_URL = "postgresql://postgres:postgre1234@localhost/valorant_skins"
    from sqlalchemy import create_engine
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


# Функция для получения сессии базы данных
def get_db():
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()