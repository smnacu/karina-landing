'use client';

import { useEffect, useState } from 'react';

interface BookingDetails {
  id: number;
  client_id: number;
  event_id: number;
  total_price_ars: number;
  status: string; // Placeholder for booking status
  payment_link?: string; // Placeholder for payment link
}

export default function Reserva({ params }: { params: { bookingId: string } }) {
  const { bookingId } = params;
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you would fetch booking details from your backend here
    // For now, we'll simulate fetching data
    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBooking({
          id: parseInt(bookingId),
          client_id: 123,
          event_id: 456,
          total_price_ars: 150000,
          status: "Pendiente de Seña", // Example status
          payment_link: "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=fake_preference_id" // Example link
        });
      } catch (e: any) {
        setError("Error al cargar los detalles de la reserva.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) return <p className="text-center mt-8">Cargando detalles de la reserva...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Error: {error}</p>;
  if (!booking) return <p className="text-center mt-8">Reserva no encontrada.</p>;

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Detalles de la Reserva #{booking.id}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg mb-2"><strong>Estado:</strong> <span className="font-semibold text-blue-600">{booking.status}</span></p>
        <p className="text-lg mb-2"><strong>Monto Total:</strong> ARS {booking.total_price_ars.toLocaleString('es-AR')}</p>
        {booking.payment_link && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <p className="font-bold">Link de Pago:</p>
            <a href={booking.payment_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
              {booking.payment_link}
            </a>
            <p className="text-sm mt-2">Utiliza este link para completar el pago de tu reserva.</p>
          </div>
        )}
        <p className="text-sm mt-4 text-gray-500">Cliente ID: {booking.client_id}, Evento ID: {booking.event_id}</p>
      </div>
    </main>
  );
}