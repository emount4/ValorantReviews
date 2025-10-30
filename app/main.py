from sys import prefix

from fastapi import FastAPI
from database import db
from routers import auth, system, routes

from fastapi import Depends
from routers.auth import get_current_user
app = FastAPI()

@app.get("/protected-route")
async def protected_route(current_user = Depends(get_current_user)):
    return {"message": f"Hello {current_user['username']}"}

# Подключаем роутеры
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(system.router, tags=["system"])

app.include_router(routes.router, prefix="/routes", tags=["routes"])


@app.get("/")
async def root():
    return {"message": "Valorant Skins API", "status": "running"}

# Тестирование подключения при старте
@app.on_event("startup")
async def startup_event():
    print("🧪 Testing database connection...")
    connection_test = db.test_connection()
    print(f"Database connection: {connection_test['status']}")
    if connection_test['status'] == 'success':
        print(f"📊 Tables found: {connection_test['table_count']}")
        print(f"📋 Table names: {', '.join(connection_test['table_names'])}")
    else:
        print(f"❌ Connection failed: {connection_test['message']}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

