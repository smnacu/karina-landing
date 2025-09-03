from fastapi import APIRouter, Depends, WebSocket, UploadFile, File, HTTPException, WebSocketDisconnect
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict
import csv
import io

from core.db import SessionLocal
from models.karaoke import Song, SongRequest, SongRequestStatus

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, event_id: int):
        await websocket.accept()
        if event_id not in self.active_connections:
            self.active_connections[event_id] = []
        self.active_connections[event_id].append(websocket)

    def disconnect(self, websocket: WebSocket, event_id: int):
        self.active_connections[event_id].remove(websocket)

    async def broadcast(self, event_id: int, message: str):
        if event_id in self.active_connections:
            for connection in self.active_connections[event_id]:
                await connection.send_text(message)

manager = ConnectionManager()

class SongCreate(BaseModel):
    artist: str
    title: str
    language: str | None = None
    duration_seconds: int | None = None
    genre_tags: str | None = None

class SongResponse(SongCreate):
    id: int

    class Config:
        from_attributes = True

class SongRequestCreate(BaseModel):
    song_id: int
    requester_name: str

class SongRequestResponse(SongRequestCreate):
    id: int
    status: SongRequestStatus
    play_order: int

    class Config:
        from_attributes = True

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/songs", response_model=List[SongResponse])
def get_songs(db: Session = Depends(get_db)):
    songs = db.query(Song).all()
    return songs

@router.post("/import")
def import_songs(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    content = file.file.read().decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(content))
    songs_to_add = []
    for row in csv_reader:
        song = Song(
            artist=row['artist'],
            title=row['title'],
            language=row.get('language'),
            duration_seconds=row.get('duration_seconds'),
            genre_tags=row.get('genre_tags')
        )
        songs_to_add.append(song)
    
    db.add_all(songs_to_add)
    db.commit()

    return {"status": "Songs imported successfully", "count": len(songs_to_add)}

@router.post("/events/{event_id}/requests", response_model=SongRequestResponse)
async def create_song_request(event_id: int, request: SongRequestCreate, db: Session = Depends(get_db)):
    # Determine the next play_order
    last_request = db.query(SongRequest).filter(SongRequest.event_id == event_id).order_by(SongRequest.play_order.desc()).first()
    next_play_order = (last_request.play_order + 1) if last_request else 0

    db_song_request = SongRequest(
        event_id=event_id,
        song_id=request.song_id,
        requester_name=request.requester_name,
        play_order=next_play_order,
        status=SongRequestStatus.PENDING
    )
    db.add(db_song_request)
    db.commit()
    db.refresh(db_song_request)

    # Notify connected WebSocket clients about the new request
    await manager.broadcast(event_id, f"New song request: {db_song_request.requester_name} - {db_song_request.song_id}") # Simplified message

    return db_song_request

@router.get("/events/{event_id}/requests", response_model=List[SongRequestResponse])
def get_song_requests(event_id: int, db: Session = Depends(get_db)):
    requests = db.query(SongRequest).filter(SongRequest.event_id == event_id).all()
    return requests

@router.get("/events/{event_id}/queue", response_model=List[SongRequestResponse])
def get_song_queue(event_id: int, db: Session = Depends(get_db)):
    queue = db.query(SongRequest).filter(SongRequest.event_id == event_id, SongRequest.status == SongRequestStatus.PENDING).order_by(SongRequest.play_order).all()
    return queue

@router.websocket("/ws/events/{event_id}/queue")
async def websocket_endpoint(websocket: WebSocket, event_id: int):
    await manager.connect(websocket, event_id)
    try:
        while True:
            # Keep connection alive, or handle messages from client if needed
            await websocket.receive_text() 
    except WebSocketDisconnect:
        manager.disconnect(websocket, event_id)
