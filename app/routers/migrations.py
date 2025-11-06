from fastapi import APIRouter, HTTPException

from app.database_methods.migrations.base_migration import BaseMigration

migrations = BaseMigration()
router = APIRouter()

@router.post("/make")
async def make_db():
    try:
        result = migrations.make()
        if isinstance(result, Exception):
            raise HTTPException(status_code=500, detail=str(result))
        return {"status": "success", "message": "Migration completed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Migration failed: {str(e)}")
