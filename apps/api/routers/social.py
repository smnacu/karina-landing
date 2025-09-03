from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List

router = APIRouter()

class InstagramPost(BaseModel):
    id: str
    caption: str
    media_url: str
    permalink: str
    timestamp: str

@router.get("/instagram/feed", response_model=List[InstagramPost])
def get_instagram_feed():
    # Placeholder for Instagram API integration
    # In a real application, you would fetch data from Instagram Basic Display API or Graph API
    return [
        {
            "id": "1",
            "caption": "¡Gran evento de karaoke anoche! #karaoke #fiesta",
            "media_url": "https://via.placeholder.com/150/FF0000/FFFFFF?text=Post1",
            "permalink": "https://instagram.com/p/1",
            "timestamp": "2025-08-27T10:00:00Z"
        },
        {
            "id": "2",
            "caption": "Preparando el show para el fin de semana. #musicaenvivo #show",
            "media_url": "https://via.placeholder.com/150/0000FF/FFFFFF?text=Post2",
            "permalink": "https://instagram.com/p/2",
            "timestamp": "2025-08-26T15:30:00Z"
        }
    ]
