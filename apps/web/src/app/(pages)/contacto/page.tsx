'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const leadSchema = z.object({
  contact_name: z.string().min(2, "El nombre es requerido"),
  contact_email: z.string().email("El email no es válido"),
  contact_phone: z.string().optional(),
  message: z.string().min(10, "El mensaje es muy corto").optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export default function Contacto() {
  const { register, handleSubmit, formState: { errors } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormValues) => {
    const response = await fetch('/api/leads', { // This will be proxied to the backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      alert('Gracias por tu consulta!');
    } else {
      alert('Error al enviar la consulta.');
    }
  };

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Pedir Cotización</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input {...register('contact_name')} id="contact_name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          {errors.contact_name && <p className="text-red-500 text-xs mt-1">{errors.contact_name.message}</p>}
        </div>
        <div>
          <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">Email</label>
          <input {...register('contact_email')} id="contact_email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email.message}</p>}
        </div>
        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">Teléfono (WhatsApp)</label>
          <input {...register('contact_phone')} id="contact_phone" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
          <textarea {...register('message')} id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>
        <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Enviar Consulta</button>
      </form>
    </main>
  );
}