from sys import prefix

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware


from database import db
from routers import auth, system, routes, crud_router, migrations

from fastapi import Depends
from routers.auth import get_current_user
app = FastAPI()

@app.get("/protected-route")
async def protected_route(current_user = Depends(get_current_user)):
    return {"message": f"Hello {current_user['username']}"}

# Подключаем роутеры
app.include_router(auth.router, prefix="/auth")

@app.get("/protected")
async def protected(user: dict = Depends(get_current_user)):
    return {"message": f"Hello {user['email']}"}
app.include_router(system.router, tags=["system"])

app.include_router(routes.router, prefix="/routes", tags=["routes"])

app.include_router(crud_router.router, prefix="/crud_router", tags=["crud_router"])

app.include_router(migrations.router, prefix="/migration", tags=["migration"]  )
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    #деплой
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

