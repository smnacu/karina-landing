import enum
from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from core.db import Base
from .event import Event

class SongRequestStatus(str, enum.Enum):
    PENDING = "pending"
    PLAYING = "playing"
    PLAYED = "played"
    SKIPPED = "skipped"

class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    artist = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False, index=True)
    language = Column(String)
    duration_seconds = Column(Integer)
    genre_tags = Column(String) # Comma-separated tags

class SongRequest(Base):
    __tablename__ = "song_requests"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    requester_name = Column(String, nullable=False)
    status = Column(Enum(SongRequestStatus), default=SongRequestStatus.PENDING, nullable=False)
    play_order = Column(Integer, default=0)

    event = relationship("Event")
    song = relationship("Song")
