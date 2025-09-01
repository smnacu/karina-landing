'use client';

import { useState } from 'react';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    event_type: '',
    event_date: '',
    event_location: '',
    num_guests: '',
    interested_services: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/leads/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('¡Consulta enviada exitosamente!');
        setFormData({
          contact_name: '',
          contact_email: '',
          contact_phone: '',
          event_type: '',
          event_date: '',
          event_location: '',
          num_guests: '',
          interested_services: '',
          message: ''
        });
      } else {
        alert('Error al enviar la consulta');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error de conexión');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Contacto - Karina Ocampo
          </h1>
          <p className="text-gray-600 mb-8">
            Completa el formulario para solicitar una cotización para tu evento
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">
              Nombre completo *
            </label>
            <input
              type="text"
              name="contact_name"
              id="contact_name"
              required
              value={formData.contact_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>

          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              name="contact_email"
              id="contact_email"
              required
              value={formData.contact_email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>

          <div>
            <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              name="contact_phone"
              id="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>

          <div>
            <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">
              Tipo de evento
            </label>
            <select
              name="event_type"
              id="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            >
              <option value="">Seleccionar tipo</option>
              <option value="Cumpleaños">Cumpleaños</option>
              <option value="Boda">Boda</option>
              <option value="Evento corporativo">Evento corporativo</option>
              <option value="Fiesta privada">Fiesta privada</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label htmlFor="event_date" className="block text-sm font-medium text-gray-700">
              Fecha del evento
            </label>
            <input
              type="date"
              name="event_date"
              id="event_date"
              value={formData.event_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>

          <div>
            <label htmlFor="event_location" className="block text-sm font-medium text-gray-700">
              Ubicación del evento
            </label>
            <input
              type="text"
              name="event_location"
              id="event_location"
              value={formData.event_location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>

          <div>
            <label htmlFor="num_guests" className="block text-sm font-medium text-gray-700">
              Número de invitados
            </label>
            <input
              type="number"
              name="num_guests"
              id="num_guests"
              value={formData.num_guests}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>

          <div>
            <label htmlFor="interested_services" className="block text-sm font-medium text-gray-700">
              Servicios de interés
            </label>
            <input
              type="text"
              name="interested_services"
              id="interested_services"
              value={formData.interested_services}
              onChange={handleChange}
              placeholder="Ej: Karaoke, música en vivo, animación"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Mensaje adicional
            </label>
            <textarea
              name="message"
              id="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Enviar consulta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}