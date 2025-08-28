'use client';

import { useEffect, useState } from 'react';

interface SongRequest {
  id: number;
  song_id: number;
  requester_name: string;
  status: string;
  play_order: number;
  // Add song details if needed, e.g., title, artist
}

export default function KaraokePublic({ params }: { params: { eventId: string } }) {
  const { eventId } = params;
  const [queue, setQueue] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial queue
    const fetchInitialQueue = async () => {
      try {
        const response = await fetch(`/api/karaoke/events/${eventId}/queue`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: SongRequest[] = await response.json();
        setQueue(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialQueue();

    // WebSocket connection
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/karaoke/ws/events/${eventId}/queue`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      // In a real app, you'd parse the message and update the queue state more intelligently
      // For now, we'll just re-fetch the queue for simplicity on any message
      fetchInitialQueue(); 
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

  if (loading) return <p className="text-center mt-8">Cargando cola de karaoke...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Error: {error}</p>;

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Karaoke - Próximos en Cantar (Evento: {eventId})</h1>
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
                </tr>
              </thead>
              <tbody>
                {queue.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{request.play_order}</td>
                    <td className="py-2 px-4 border-b">{request.requester_name}</td>
                    <td className="py-2 px-4 border-b">{request.song_id}</td>
                    <td className="py-2 px-4 border-b">{request.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </main>
  );
}