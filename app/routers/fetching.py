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

    def get_bundles(self):
        data = self.fetch_valorant_data("bundles")
        bundles = []

        for bundle in data.get("data", []):
            bundles.append({
                "uuid": bundle.get("uuid"),
                "display_name": bundle.get("displayName"),
                "image_url": bundle.get("displayIcon")
                })

        return bundles

    def get_rarity(self):
        data = self.fetch_valorant_data("contenttiers")
        raritys = []

        for rarity in data.get("data", []):
            raritys.append({
                "uuid": rarity.get("uuid"),
                "display_name": rarity.get("displayName"),
                "displayIcon": rarity.get("displayIcon")
            })
        return raritys

