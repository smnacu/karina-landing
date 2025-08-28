'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface Lead {
  id: number;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  event_type?: string;
  message?: string;
  status: string;
  event_date?: string; // Assuming ISO string from backend
  event_location?: string;
  num_guests?: number;
  interested_services?: string;
}

interface Equipment {
  id: number;
  name: string;
  category?: string;
  status: string;
}

interface EquipmentAssignment {
  id: number;
  event_id: number;
  equipment_id: number;
}

interface Contract {
  id: number;
  booking_id: number;
  template_id?: string;
  version: number;
  status: string;
  file_url?: string;
}

interface Document {
  id: number;
  owner_id: number;
  owner_type: string;
  document_type: string;
  file_url: string;
  extra_data?: string;
}

interface OverviewReport {
  total_leads: number;
  confirmed_bookings: number;
  total_revenue: number;
}

interface AppSettings {
  default_deposit_percentage: number;
  coverage_zones: string[];
}

const quoteSchema = z.object({
  amount: z.number().min(1, "El monto debe ser mayor a 0"),
  description: z.string().min(5, "La descripción es requerida"),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

const settingsSchema = z.object({
  default_deposit_percentage: z.number().min(0).max(1, "El porcentaje debe estar entre 0 y 1"),
  coverage_zones: z.string().transform(val => val.split(',').map(s => s.trim()).filter(s => s.length > 0)),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function Admin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [assignments, setAssignments] = useState<EquipmentAssignment[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [overviewReport, setOverviewReport] = useState<OverviewReport | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const { register: quoteRegister, handleSubmit: handleQuoteSubmitForm, formState: { errors: quoteErrors }, reset: resetQuoteForm } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
  });

  const { register: settingsRegister, handleSubmit: handleSettingsSubmitForm, formState: { errors: settingsErrors }, reset: resetSettingsForm, setValue: setSettingsValue } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchLeads(),
        fetchEquipment(),
        fetchAssignments(),
        fetchContracts(),
        fetchDocuments(),
        fetchOverviewReport(),
        fetchAppSettings()
      ]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    const response = await fetch('/api/leads');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Lead[] = await response.json();
    setLeads(data);
  };

  const fetchEquipment = async () => {
    const response = await fetch('/api/inventory/equipment');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Equipment[] = await response.json();
    setEquipment(data);
  };

  const fetchAssignments = async () => {
    const response = await fetch('/api/inventory/assignments');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: EquipmentAssignment[] = await response.json();
    setAssignments(data);
  };

  const fetchContracts = async () => {
    const response = await fetch('/api/documents/contracts');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Contract[] = await response.json();
    setContracts(data);
  };

  const fetchDocuments = async () => {
    const response = await fetch('/api/documents/documents'); // Assuming a /documents endpoint for general docs
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Document[] = await response.json();
    setDocuments(data);
  };

  const fetchOverviewReport = async () => {
    const response = await fetch('/api/reports/overview');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: OverviewReport = await response.json();
    setOverviewReport(data);
  };

  const fetchAppSettings = async () => {
    const response = await fetch('/api/settings');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: AppSettings = await response.json();
    setAppSettings(data);
    setSettingsValue('default_deposit_percentage', data.default_deposit_percentage);
    setSettingsValue('coverage_zones', data.coverage_zones.join(', '));
  };

  const handleCreateQuoteClick = (lead: Lead) => {
    setSelectedLead(lead);
    setShowQuoteModal(true);
    setPaymentLink(null); // Clear previous link
    resetQuoteForm(); // Reset form fields
  };

  const handleQuoteSubmit = async (data: QuoteFormValues) => {
    if (!selectedLead) return;

    try {
      const response = await fetch('/api/payments/mp/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: selectedLead.id, // Using lead ID as booking_id for now, will change later
          amount: data.amount,
          description: data.description,
          payer_email: selectedLead.contact_email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setPaymentLink(result.init_point);

    } catch (e: any) {
      alert(`Error al crear la cotización: ${e.message}`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo para subir.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      alert("Documento subido exitosamente!");
      setSelectedFile(null);
      fetchDocuments(); // Refresh documents list
    } catch (e: any) {
      alert(`Error al subir el documento: ${e.message}`);
    }
  };

  const handleSettingsSubmit = async (data: SettingsFormValues) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          default_deposit_percentage: data.default_deposit_percentage,
          coverage_zones: data.coverage_zones,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      alert("Configuración actualizada exitosamente!");
      fetchAppSettings(); // Refresh settings
    } catch (e: any) {
      alert(`Error al actualizar la configuración: ${e.message}`);
    }
  };

  if (loading) return <p className="text-center mt-8">Cargando datos...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Error: {error}</p>;

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Panel de Administración</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Configuración de la Aplicación</h2>
        {
          appSettings ? (
            <form onSubmit={handleSettingsSubmitForm(handleSettingsSubmit)} className="space-y-4 max-w-lg">
              <div>
                <label htmlFor="default_deposit_percentage" className="block text-sm font-medium text-gray-700">Porcentaje de Seña por Defecto</label>
                <input
                  type="number"
                  step="0.01"
                  {...settingsRegister('default_deposit_percentage', { valueAsNumber: true })}
                  id="default_deposit_percentage"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {settingsErrors.default_deposit_percentage && <p className="text-red-500 text-xs mt-1">{settingsErrors.default_deposit_percentage.message}</p>}
              </div>
              <div>
                <label htmlFor="coverage_zones" className="block text-sm font-medium text-gray-700">Zonas de Cobertura (separadas por coma)</label>
                <textarea
                  {...settingsRegister('coverage_zones')}
                  id="coverage_zones"
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {settingsErrors.coverage_zones && <p className="text-red-500 text-xs mt-1">{settingsErrors.coverage_zones.message}</p>}
              </div>
              <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Guardar Configuración</button>
            </form>
          ) : (
            <p>Cargando configuración...</p>
          )
        }
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Reporte General</h2>
        {
          overviewReport ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total Leads</h3>
                <p className="text-3xl font-bold text-blue-600">{overviewReport.total_leads}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold">Reservas Confirmadas</h3>
                <p className="text-3xl font-bold text-green-600">{overviewReport.confirmed_bookings}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold">Ingresos Totales</h3>
                <p className="text-3xl font-bold text-purple-600">ARS {overviewReport.total_revenue.toLocaleString('es-AR')}</p>
              </div>
            </div>
          ) : (
            <p>No hay datos de reporte para mostrar.</p>
          )
        }
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Leads</h2>
        {
          leads.length === 0 ? (
            <p>No hay leads para mostrar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">ID</th>
                    <th className="py-2 px-4 border-b text-left">Nombre</th>
                    <th className="py-2 px-4 border-b text-left">Email</th>
                    <th className="py-2 px-4 border-b text-left">Teléfono</th>
                    <th className="py-2 px-4 border-b text-left">Tipo Evento</th>
                    <th className="py-2 px-4 border-b text-left">Mensaje</th>
                    <th className="py-2 px-4 border-b text-left">Estado</th>
                    <th className="py-2 px-4 border-b text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{lead.id}</td>
                      <td className="py-2 px-4 border-b">{lead.contact_name}</td>
                      <td className="py-2 px-4 border-b">{lead.contact_email}</td>
                      <td className="py-2 px-4 border-b">{lead.contact_phone || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{lead.event_type || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{lead.message || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{lead.status}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleCreateQuoteClick(lead)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                        >
                          Crear Cotización
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

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Inventario de Equipos</h2>
        {
          equipment.length === 0 ? (
            <p>No hay equipos para mostrar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">ID</th>
                    <th className="py-2 px-4 border-b text-left">Nombre</th>
                    <th className="py-2 px-4 border-b text-left">Categoría</th>
                    <th className="py-2 px-4 border-b text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{item.id}</td>
                      <td className="py-2 px-4 border-b">{item.name}</td>
                      <td className="py-2 px-4 border-b">{item.category || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Asignaciones de Equipos</h2>
        {
          assignments.length === 0 ? (
            <p>No hay asignaciones de equipos para mostrar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">ID</th>
                    <th className="py-2 px-4 border-b text-left">ID Evento</th>
                    <th className="py-2 px-4 border-b text-left">ID Equipo</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{assignment.id}</td>
                      <td className="py-2 px-4 border-b">{assignment.event_id}</td>
                      <td className="py-2 px-4 border-b">{assignment.equipment_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Contratos</h2>
        {
          contracts.length === 0 ? (
            <p>No hay contratos para mostrar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">ID</th>
                    <th className="py-2 px-4 border-b text-left">ID Reserva</th>
                    <th className="py-2 px-4 border-b text-left">Plantilla</th>
                    <th className="py-2 px-4 border-b text-left">Versión</th>
                    <th className="py-2 px-4 border-b text-left">Estado</th>
                    <th className="py-2 px-4 border-b text-left">URL Archivo</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{contract.id}</td>
                      <td className="py-2 px-4 border-b">{contract.booking_id}</td>
                      <td className="py-2 px-4 border-b">{contract.template_id || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{contract.version}</td>
                      <td className="py-2 px-4 border-b">{contract.status}</td>
                      <td className="py-2 px-4 border-b">
                        {contract.file_url ? (
                          <a href={contract.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver</a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Documentos</h2>
        <div className="mb-4">
          <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <button
            onClick={handleUploadDocument}
            className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Subir Documento
          </button>
        </div>
        {
          documents.length === 0 ? (
            <p>No hay documentos para mostrar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">ID</th>
                    <th className="py-2 px-4 border-b text-left">Tipo Propietario</th>
                    <th className="py-2 px-4 border-b text-left">ID Propietario</th>
                    <th className="py-2 px-4 border-b text-left">Tipo Documento</th>
                    <th className="py-2 px-4 border-b text-left">URL Archivo</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{doc.id}</td>
                      <td className="py-2 px-4 border-b">{doc.owner_type}</td>
                      <td className="py-2 px-4 border-b">{doc.owner_id}</td>
                      <td className="py-2 px-4 border-b">{doc.document_type}</td>
                      <td className="py-2 px-4 border-b">
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </section>

      {/* Quote Modal */}
      {showQuoteModal && selectedLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Crear Cotización para {selectedLead.contact_name}</h2>
            <form onSubmit={handleQuoteSubmitForm(handleQuoteSubmit)} className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto (ARS)</label>
                <input
                  type="number"
                  step="0.01"
                  {...quoteRegister('amount', { valueAsNumber: true })}
                  id="amount"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {quoteErrors.amount && <p className="text-red-500 text-xs mt-1">{quoteErrors.amount.message}</p>}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  {...quoteRegister('description')}
                  id="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {quoteErrors.description && <p className="text-red-500 text-xs mt-1">{quoteErrors.description.message}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Generar Link de Pago
                </button>
              </div>
            </form>

            {paymentLink && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                <p className="font-bold">Link de Pago Generado:</p>
                <a href={paymentLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                  {paymentLink}
                </a>
                <p className="text-sm mt-2">Comparte este link con el cliente para que realice el pago.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
