'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface Song {
  id: number;
  artist: string;
  title: string;
}

interface SongRequest {
  id: number;
  song_id: number;
  requester_name: string;
  status: string;
  play_order: number;
  song?: Song; // Populate this from backend if possible
}

const songRequestSchema = z.object({
  song_id: z.number().min(1, "Selecciona una canción"),
  requester_name: z.string().min(2, "El nombre es requerido"),
});

type SongRequestFormValues = z.infer<typeof songRequestSchema>;

export default function KaraokeHost({ params }: { params: { eventId: string } }) {
  const { eventId } = params;
  const [queue, setQueue] = useState<SongRequest[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SongRequestFormValues>({
    resolver: zodResolver(songRequestSchema),
  });

  useEffect(() => {
    fetchData();

    // WebSocket connection
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/karaoke/ws/events/${eventId}/queue`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      fetchQueue(); // Re-fetch queue on any message
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('Error de conexión en tiempo real.');
    };

    return () => {
      ws.close();
    };
  }, [eventId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchQueue(),
        fetchSongs()
      ]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueue = async () => {
    const response = await fetch(`/api/karaoke/events/${eventId}/queue`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: SongRequest[] = await response.json();
    setQueue(data);
  };

  const fetchSongs = async () => {
    const response = await fetch('/api/karaoke/songs');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: Song[] = await response.json();
    setSongs(data);
  };

  const handleAddRequest = async (data: SongRequestFormValues) => {
    try {
      const response = await fetch(`/api/karaoke/events/${eventId}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      reset();
      fetchQueue(); // Refresh queue after adding
    } catch (e: any) {
      alert(`Error al agregar la canción: ${e.message}`);
    }
  };

  const updateSongRequestStatus = async (requestId: number, newStatus: string) => {
    try {
      // In a real app, you'd have a PUT endpoint for this
      // For now, we'll just simulate and re-fetch
      alert(`Simulando cambio de estado para ${requestId} a ${newStatus}`);
      fetchQueue();
    } catch (e: any) {
      alert(`Error al actualizar estado: ${e.message}`);
    }
  };

  if (loading) return <p className="text-center mt-8">Cargando consola de karaoke...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Error: {error}</p>;

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Consola de Karaoke (Evento: {eventId})</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Agregar Nueva Solicitud</h2>
        <form onSubmit={handleSubmit(handleAddRequest)} className="space-y-4 max-w-lg">
          <div>
            <label htmlFor="song_id" className="block text-sm font-medium text-gray-700">Canción</label>
            <select {...register('song_id', { valueAsNumber: true })} id="song_id" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="">Selecciona una canción</option>
              {songs.map(song => (
                <option key={song.id} value={song.id}>{song.artist} - {song.title}</option>
              ))}
            </select>
            {errors.song_id && <p className="text-red-500 text-xs mt-1">{errors.song_id.message}</p>}
          </div>
          <div>
            <label htmlFor="requester_name" className="block text-sm font-medium text-gray-700">Nombre del Solicitante</label>
            <input {...register('requester_name')} id="requester_name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            {errors.requester_name && <p className="text-red-500 text-xs mt-1">{errors.requester_name.message}</p>}
          </div>
          <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Agregar a la Cola</button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Cola de Karaoke Actual</h2>
        {
          queue.length === 0 ? (
            <p>La cola de canciones está vacía.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Orden</th>
                    <th className="py-2 px-4 border-b text-left">Solicitante</th>
                    <th className="py-2 px-4 border-b text-left">Canción (ID)</th>
                    <th className="py-2 px-4 border-b text-left">Estado</th>
                    <th className="py-2 px-4 border-b text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{request.play_order}</td>
                      <td className="py-2 px-4 border-b">{request.requester_name}</td>
                      <td className="py-2 px-4 border-b">{request.song_id}</td>
                      <td className="py-2 px-4 border-b">{request.status}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => updateSongRequestStatus(request.id, 'playing')}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                        >
                          En Escena
                        </button>
                        <button
                          onClick={() => updateSongRequestStatus(request.id, 'played')}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                        >
                          Cantada
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </section>
    </main>
  );
}