'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Song {
  id: number;
  artist: string;
  title: string;
  language: string;
  duration_seconds: number;
  genre_tags?: string;
}

interface QueueItem {
  id: number;
  song: Song;
  requested_by: string;
  status: string;
}

export default function KaraokePublicPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentSong, setCurrentSong] = useState<QueueItem | null>(null);

  useEffect(() => {
    // Mock data for demonstration
    setCurrentSong({
      id: 1,
      song: {
        id: 1,
        artist: "Queen",
        title: "Bohemian Rhapsody",
        language: "English",
        duration_seconds: 355
      },
      requested_by: "María",
      status: "playing"
    });

    setQueue([
      {
        id: 2,
        song: {
          id: 2,
          artist: "Luis Miguel",
          title: "La Incondicional",
          language: "Spanish",
          duration_seconds: 240
        },
        requested_by: "Carlos",
        status: "pending"
      },
      {
        id: 3,
        song: {
          id: 3,
          artist: "ABBA",
          title: "Dancing Queen",
          language: "English", 
          duration_seconds: 230
        },
        requested_by: "Ana",
        status: "pending"
      }
    ]);
  }, [eventId]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            🎤 Karaoke Night
          </h1>
          <p className="text-xl text-gray-300">
            Evento #{eventId} - ¡Disfruta la música!
          </p>
        </div>

        {/* Current Song */}
        {currentSong && (
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-6 mb-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🎵 Cantando ahora</h2>
                <div className="text-lg">
                  <p className="font-semibold">{currentSong.song.title}</p>
                  <p className="text-pink-100">por {currentSong.song.artist}</p>
                  <p className="text-pink-200 text-sm">
                    Solicitado por: {currentSong.requested_by}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl mb-2">🎤</div>
                <p className="text-pink-100 text-sm">
                  {formatDuration(currentSong.song.duration_seconds)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Queue */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🎶 Próximas canciones
          </h2>
          
          {queue.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-gray-300">
                No hay canciones en la cola
              </p>
              <p className="text-gray-400 mt-2">
                ¡Pide tu canción favorita!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white/20 rounded-lg p-4 flex items-center justify-between hover:bg-white/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.song.title}</h3>
                      <p className="text-gray-300">{item.song.artist}</p>
                      <p className="text-gray-400 text-sm">
                        Solicitado por: {item.requested_by}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-sm">
                      {formatDuration(item.song.duration_seconds)}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {item.song.language}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400">
            ¿Quieres agregar una canción? Habla con el host del evento
          </p>
        </div>
      </div>
    </div>
  );
}