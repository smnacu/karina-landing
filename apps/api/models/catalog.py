from sqlalchemy import Column, Integer, String, Text, Float
from core.db import Base

class Package(Base):
    __tablename__ = "packages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    duration_hours = Column(Float)
    base_price_ars = Column(Integer, nullable=False)

class AddOn(Base):
    __tablename__ = "addons"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    price_ars = Column(Integer, nullable=False)

class PricingRule(Base):
    __tablename__ = "pricing_rules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    condition = Column(String) # e.g., 'day_of_week == "saturday"'
    adjustment_percentage = Column(Float)
    adjustment_fixed_ars = Column(Integer)
