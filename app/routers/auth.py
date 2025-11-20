from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

from app.database import db, get_db
from app.database_methods.crud import CRUD



SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()
crud = CRUD(db)


import bcrypt

def hash_password(password: str) -> str:
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8')[:72], hashed_password.encode())


def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(email):
    user = crud.get_table_data_by_column("Accounts","email", email,1)
    return user

def authenticate_user(email, password):
    resp = get_user(email)
    # Проверяем что пользователь найден
    if not resp or resp["status"] != "success" or resp.get("row_count", 0) == 0:
        return False
    user_obj = resp["data"][0]   # берём первого найденного пользователя
    if not verify_password(password, user_obj["password_hash"]):
        return False
    return user_obj


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user["username"]}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

from fastapi import Depends
from jose import JWTError, jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Ищем пользователя по username (который хранится в токене)
    user_resp = crud.get_table_data_by_column("Accounts", "username", username, 1)

    if not user_resp or user_resp["status"] != "success" or user_resp.get("row_count", 0) == 0:
        raise credentials_exception

    user = user_resp["data"][0]

    # Для отладки - выведем все поля пользователя
    print("User data from DB:", user.keys())  # Это покажет все доступные поля

    # Возвращаем только необходимые данные пользователя
    user_data = {
        "id": user.get("id"),
        "username": user.get("username"),
        "email": user.get("email"),
        "created_at": user.get("created_at")
    }

    # Если created_at нет, попробуем другие возможные названия
    if user_data["created_at"] is None:
        user_data["created_at"] = user.get("created_date") or user.get("date_created") or user.get(
            "registration_date") or "Не указано"

    return user_data
#Регистрация

from pydantic import BaseModel, EmailStr, constr

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: constr(min_length=8)


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    db_user = crud.get_table_data_by_column("Accounts", "email", user.email, 1)
    if db_user["status"] == "success" and db_user.get("row_count", 0) > 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    user_data = {
        "username": user.username,
        "email": user.email,
        "password_hash": hashed_password
    }
    result = crud.insert_data("Accounts", user_data)
    if result["status"] != "success":
        raise HTTPException(status_code=500, detail=result["message"])
    return {"message": "Account created"}

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user