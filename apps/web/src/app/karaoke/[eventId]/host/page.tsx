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

export default function KaraokeHostPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentSong, setCurrentSong] = useState<QueueItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [availableSongs] = useState<Song[]>([
    {
      id: 1,
      artist: "Queen",
      title: "Bohemian Rhapsody",
      language: "English",
      duration_seconds: 355
    },
    {
      id: 2,
      artist: "Luis Miguel", 
      title: "La Incondicional",
      language: "Spanish",
      duration_seconds: 240
    },
    {
      id: 3,
      artist: "ABBA",
      title: "Dancing Queen",
      language: "English",
      duration_seconds: 230
    },
    {
      id: 4,
      artist: "Manu Chao",
      title: "Bongo Bong",
      language: "Spanish",
      duration_seconds: 185
    }
  ]);

  useEffect(() => {
    // Mock current song and queue
    setCurrentSong({
      id: 1,
      song: availableSongs[0],
      requested_by: "María",
      status: "playing"
    });

    setQueue([
      {
        id: 2,
        song: availableSongs[1],
        requested_by: "Carlos",
        status: "pending"
      }
    ]);
  }, [eventId, availableSongs]);

  const filteredSongs = availableSongs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToQueue = (song: Song) => {
    if (!requesterName.trim()) {
      alert('Por favor ingresa el nombre del solicitante');
      return;
    }

    const newQueueItem: QueueItem = {
      id: Date.now(),
      song,
      requested_by: requesterName.trim(),
      status: 'pending'
    };

    setQueue([...queue, newQueueItem]);
    setRequesterName('');
    alert(`&ldquo;${song.title}&rdquo; agregada a la cola`);
  };

  const playNext = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setCurrentSong(nextSong);
      setQueue(queue.slice(1));
    }
  };

  const removeFromQueue = (id: number) => {
    setQueue(queue.filter(item => item.id !== id));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎤 Consola del Host - Karaoke
          </h1>
          <p className="text-xl text-gray-600">
            Evento #{eventId} - Panel de control
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Song & Queue */}
          <div className="space-y-6">
            {/* Current Song */}
            {currentSong && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">🎵 Cantando ahora</h2>
                <div>
                  <h3 className="text-lg font-semibold">{currentSong.song.title}</h3>
                  <p className="text-purple-100">{currentSong.song.artist}</p>
                  <p className="text-purple-200 text-sm">
                    Solicitado por: {currentSong.requested_by}
                  </p>
                  <p className="text-purple-200 text-sm">
                    Duración: {formatDuration(currentSong.song.duration_seconds)}
                  </p>
                </div>
                <button
                  onClick={playNext}
                  disabled={queue.length === 0}
                  className="mt-4 bg-white text-purple-600 px-4 py-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente canción
                </button>
              </div>
            )}

            {/* Queue */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">🎶 Cola de canciones</h2>
              {queue.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No hay canciones en la cola
                </p>
              ) : (
                <div className="space-y-3">
                  {queue.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{item.song.title}</p>
                          <p className="text-sm text-gray-600">
                            {item.song.artist} - {item.requested_by}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromQueue(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Songs */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">➕ Agregar canciones</h2>
            
            {/* Requester Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del solicitante
              </label>
              <input
                type="text"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Nombre de quien pide la canción"
              />
            </div>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar canciones
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Buscar por título o artista..."
              />
            </div>

            {/* Song List */}
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {filteredSongs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded hover:bg-gray-100"
                  >
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-sm text-gray-600">
                        {song.artist} • {formatDuration(song.duration_seconds)} • {song.language}
                      </p>
                    </div>
                    <button
                      onClick={() => addToQueue(song)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
              
              {filteredSongs.length === 0 && searchTerm && (
                <p className="text-gray-500 text-center py-4">
                  No se encontraron canciones que coincidan con &ldquo;{searchTerm}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href={`/karaoke/${eventId}/public`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            🔗 Ver pantalla pública
          </a>
        </div>
      </div>
    </div>
  );
}