from fastapi import APIRouter, HTTPException
from .fetching import ValorantAPI

router = APIRouter()
api = ValorantAPI()

@router.get("/skins")
def get_skins():
    try:
        skins = api.get_skins()
        if not skins:
            raise HTTPException(status_code=404, detail="No skins found")
        return {"status": "success", "data": skins}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
