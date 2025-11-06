from abc import ABC, abstractmethod
from app.database import db
from app.database_methods.crud import CRUD
from app.routers.routes import get_skins, get_rarity


def generate_collection_version_name(collection_name, existing_names):
    """
    collection_name - основное имя коллекции без версии, например "Bundle"
    existing_names - список всех имен коллекций из БД, например ["Bundle", "Bundle V2", "Bundle V3"]
    """

    # Находим все версии в существующих именах
    versions = [0]  # минимальная версия - 0 без V
    prefix = collection_name + " V"
    for name in existing_names:
        if name == collection_name:
            versions.append(0)
        elif name.startswith(prefix):
            suffix = name.replace(prefix, "").strip()
            try:
                ver = int(suffix)
                versions.append(ver)
            except ValueError:
                pass

    max_ver = max(versions)
    if max_ver == 0:
        # следующая версия V2
        new_name = f"{collection_name} V2"
    else:
        new_name = f"{collection_name} V{max_ver + 1}"
    return new_name

class BaseMigration(ABC):
    def __init__(self):
        self.db = db
        self.crud = CRUD(db)

    def make(self):
        try:
            print("🔄 Starting migration...")

            # Получаем данные - это словари от API
            bundles_response = get_skins()
            raritys_response = get_rarity()

            print(f"📦 Bundles response type: {type(bundles_response)}")
            print(f"🎨 Raritys response type: {type(raritys_response)}")

            # Извлекаем данные из словарей
            bundles = bundles_response.get("data", []) if isinstance(bundles_response, dict) else []
            raritys = raritys_response.get("data", []) if isinstance(raritys_response, dict) else []

            print(f"📦 Bundles list length: {len(bundles)}")
            print(f"🎨 Raritys list length: {len(raritys)}")

            if not bundles or not raritys:
                return {"status": "error", "message": "No data received from API"}

            inserted_bundles = 0
            inserted_rarity = 0

            # Сначала вставляем редкости
            print("🔄 Inserting rarities...")
            for rarity in raritys:
                if not isinstance(rarity, dict):
                    continue

                rarity_data = {
                    "uuid": rarity.get("uuid", ""),
                    "display_name": rarity.get("display_name", "Unknown"),
                    "displayIcon": rarity.get("displayIcon", "") or ""
                }

                result = self.crud.insert_data("Rarity", rarity_data)
                if result["status"] == "success":
                    inserted_rarity += 1
                    print(f"✓ Inserted rarity: {rarity_data['display_name']}")
                else:
                    print(f"✗ Failed to insert rarity {rarity_data['display_name']}: {result['message']}")

            # Затем вставляем коллекции
            print("🔄 Inserting collections...")
            for bundle in bundles:
                if not isinstance(bundle, dict):
                    continue

                # Получаем существующие имена
                existing_names_resp = self.crud.get_column_values("Collections", "display_name")
                existing_names = existing_names_resp.get("data", []) if existing_names_resp.get(
                    "status") == "success" else []

                base_name = bundle.get("display_name", "Unknown")

                if base_name in existing_names:
                    new_name = generate_collection_version_name(base_name, existing_names)
                    display_name = new_name
                else:
                    display_name = base_name

                # Подготавливаем данные для таблицы Collections
                collection_data = {
                    "uuid": bundle.get("uuid", ""),
                    "display_name": display_name,
                    "image_url": bundle.get("image_url", ""),
                    "release_date": None,
                    "rarity_id": None,
                    "price": None,
                    "description": "",
                    "is_active": True
                }

                result = self.crud.insert_data("Collections", collection_data)
                if result["status"] == "success":
                    inserted_bundles += 1
                    print(f"✓ Inserted collection: {collection_data['display_name']}")
                else:
                    print(f"✗ Failed to insert collection {collection_data['display_name']}: {result['message']}")

            return {
                "status": "success",
                "inserted_bundles": inserted_bundles,
                "inserted_rarity": inserted_rarity
            }

        except Exception as e:
            print(f"❌ Migration error: {str(e)}")
            import traceback
            print(f"🔍 Full traceback: {traceback.format_exc()}")
            return {"status": "error", "message": str(e)}
    # def get_version(self):
    #     pass

