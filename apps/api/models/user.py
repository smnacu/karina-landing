import enum
from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from core.db import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    PROVIDER = "provider"
    CLIENT = "client"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)

    provider_profile = relationship("ProviderProfile", back_populates="user", uselist=False)
    client_profile = relationship("ClientProfile", back_populates="user", uselist=False)

class ProviderProfile(Base):
    __tablename__ = "provider_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skills = Column(String)
    availability = Column(String) # Simple string for now, could be a JSON field
    internal_rate = Column(Integer) # In ARS cents

    user = relationship("User", back_populates="provider_profile")
    # documents relationship to be added later

class ClientProfile(Base):
    __tablename__ = "client_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    billing_details = Column(String) # Simple string for now

    user = relationship("User", back_populates="client_profile")
