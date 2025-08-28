import os
import sys
from datetime import datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the parent directory to the sys.path to allow imports from core and models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core.db import Base, SessionLocal
from models.user import User, UserRole, ProviderProfile
from models.catalog import Package, AddOn
from models.karaoke import Song
from models.inventory import Equipment
from models.document import ContractTemplate

# Hash password (for simplicity, not using a proper hashing library here)
def hash_password(password: str) -> str:
    return password + "_hashed"

def seed_data():
    engine = create_engine(os.getenv("DATABASE_URL"))
    Base.metadata.create_all(engine) # Ensure tables are created

    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = Session()

    try:
        # Create Admin User
        admin_user = User(
            full_name="Karina Ocampo",
            email="karina@example.com",
            phone_number="+5491112345678",
            hashed_password=hash_password("adminpass"),
            role=UserRole.ADMIN
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print(f"Created admin user: {admin_user.email}")

        # Create Demo Provider
        provider_user = User(
            full_name="DJ Demo",
            email="djdemo@example.com",
            phone_number="+5491198765432",
            hashed_password=hash_password("djpass"),
            role=UserRole.PROVIDER
        )
        db.add(provider_user)
        db.commit()
        db.refresh(provider_user)
        print(f"Created provider user: {provider_user.email}")

        provider_profile = ProviderProfile(
            user_id=provider_user.id,
            skills="DJ, Animador",
            availability="Weekends",
            internal_rate=50000
        )
        db.add(provider_profile)
        db.commit()
        print(f"Created provider profile for: {provider_user.email}")

        # Create Packages
        package1 = Package(name="Básico", description="Sonido y animación", duration_hours=3.0, base_price_ars=50000)
        package2 = Package(name="Estándar", description="Sonido, animación y luces", duration_hours=4.0, base_price_ars=80000)
        package3 = Package(name="Premium", description="Sonido, animación, luces y karaoke", duration_hours=5.0, base_price_ars=120000)
        db.add_all([package1, package2, package3])
        db.commit()
        print("Created packages.")

        # Create Add-ons
        addon1 = AddOn(name="Hora Extra", description="Hora adicional de servicio", price_ars=15000)
        addon2 = AddOn(name="Máquina de Humo", description="Efecto de humo", price_ars=10000)
        db.add_all([addon1, addon2])
        db.commit()
        print("Created add-ons.")

        # Create Songs (sample from CSV)
        sample_songs = [
            {"artist": "Queen", "title": "Bohemian Rhapsody", "language": "English", "duration_seconds": 354, "genre_tags": "Rock,Classic"},
            {"artist": "Luis Miguel", "title": "La Barca", "language": "Spanish", "duration_seconds": 210, "genre_tags": "Bolero,Latin"},
            {"artist": "Soda Stereo", "title": "De Música Ligera", "language": "Spanish", "duration_seconds": 212, "genre_tags": "Rock Nacional"},
            {"artist": "Adele", "title": "Rolling in the Deep", "language": "English", "duration_seconds": 228, "genre_tags": "Pop,Soul"},
            {"artist": "Gilda", "title": "Fuiste", "language": "Spanish", "duration_seconds": 240, "genre_tags": "Cumbia,Latin"},
        ]
        songs_to_add = []
        for s in sample_songs:
            songs_to_add.append(Song(**s))
        db.add_all(songs_to_add)
        db.commit()
        print("Created sample songs.")

        # Create Equipment
        equipment1 = Equipment(name="Parlante JBL EON", category="Audio", status="available")
        equipment2 = Equipment(name="Consola Behringer Xenyx", category="Audio", status="available")
        equipment3 = Equipment(name="Micrófono Shure SM58", category="Audio", status="available")
        equipment4 = Equipment(name="Luz LED Par 64", category="Iluminación", status="available")
        db.add_all([equipment1, equipment2, equipment3, equipment4])
        db.commit()
        print("Created equipment.")

        # Create a default contract template
        contract_template = ContractTemplate(
            id="default_contract",
            name="Contrato Estándar",
            content="""
Este es el contenido del contrato estándar.
Cláusula 1: ...
Cláusula 2: ...
"""
        )
        db.add(contract_template)
        db.commit()
        print("Created default contract template.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Ensure DATABASE_URL is set in the environment
    if "DATABASE_URL" not in os.environ:
        print("Error: DATABASE_URL environment variable not set.")
        print("Please set it before running the seed script.")
        sys.exit(1)
    seed_data()
