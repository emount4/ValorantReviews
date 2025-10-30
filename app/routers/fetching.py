import requests
from fastapi import HTTPException

class ValorantAPI:
    BASE_URL = "https://valorant-api.com/v1"

    def fetch_valorant_data(self, api_path: str):
        url = f"{self.BASE_URL}/{api_path}"
        try:
            response = requests.get(url)
            response.raise_for_status()
            try:
                data = response.json()
            except ValueError:
                raise HTTPException(status_code=500, detail=f"Invalid JSON response: {response.text}")
            return data
        except requests.HTTPError as e:
            raise HTTPException(status_code=response.status_code, detail=f"API HTTP error: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    def get_skins(self):
        data = self.fetch_valorant_data("weapons")
        skins = []

        for weapon in data.get("data", []):
            for skin in weapon.get("skins", []):
                skins.append({
                    "weapon_type": weapon.get("category", "Unknown"),
                    "collection_name": skin.get("displayName"),  # Можно заменить на реальное имя, если есть маппинг
                    "rarity": None,  # Если редкость есть, добавьте обработку здесь
                    "price": (weapon.get("shopData") or {}).get("cost", 0),  # Безопасно, если shopData==None
                    "image_url": skin.get("displayIcon")
                })

        return skins




