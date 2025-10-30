from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from app.database import Database

Base = declarative_base()


class AccessLevel(Database):
    __tablename__ = 'access_level'
    id = Column(Integer, primary_key=True)
    level = Column(String, nullable=False)

class Accounts(Database):
    __tablename__ = 'accounts'
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    access_level_id = Column(Integer, ForeignKey('access_level.id'))

class CollectionWeapons(Database):
    __tablename__ = 'collection_weapons'
    id = Column(Integer, primary_key=True)
    weapon_id = Column(Integer, ForeignKey('weapons.id'))
    collection_id = Column(Integer, ForeignKey('collections.id'))
    weapon_cost = Column(Integer, nullable=False)

class Collections(Database):
    __tablename__ = 'collections'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    collection_cost = Column(Integer, nullable=False)
    rarity_id = Column(Integer, ForeignKey('rarity.id'))
    image = Column(String, nullable=False)
    total_reviews = Column(Integer, nullable=False)
    avg_rating = Column(Integer, nullable=False)

class CollectionsReviews(Database):
    __tablename__ = 'collections_reviews'
    id = Column(Integer, primary_key=True)
    collection_id = Column(Integer, ForeignKey('collections.id'))
    text = Column(Text, nullable=False)
    rate = Column(Integer, nullable=False)
    animations = Column(Integer, nullable=False)
    sounds = Column(Integer, nullable=False)
    visuals = Column(Integer, nullable=False)
    effects = Column(Integer, nullable=False)
    vibe = Column(Integer, nullable=False)

class Rarity(Database):
    __tablename__ = 'rarity'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

class Weapons(Database):
    __tablename__ = 'weapons'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
