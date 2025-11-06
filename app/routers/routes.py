from fastapi import APIRouter, HTTPException
from .fetching import ValorantAPI

router = APIRouter()
api = ValorantAPI()

@router.get("/bundles")
def get_skins():
    try:
        skins = api.get_bundles()
        if not skins:
            raise HTTPException(status_code=404, detail="No skins found")
        return {"status": "success", "data": skins}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rarity")
def get_rarity():
    try:
        rarity = api.get_rarity()
        if not rarity:
            raise HTTPException(status_code=404, detail="No rarity found")
        return {"status": "success", "data": rarity}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))