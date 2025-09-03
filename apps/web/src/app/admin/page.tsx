'use client';

import { useState, useEffect } from 'react';

interface Lead {
  id: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  event_type: string;
  event_date: string;
  event_location: string;
  num_guests: number;
  interested_services: string;
  message: string;
  status: string;
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState({
    default_deposit_percentage: 0.30,
    coverage_zones: ['AMBA', 'La Plata']
  });

  useEffect(() => {
    fetchLeads();
    fetchSettings();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('http://localhost:8000/leads/');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:8000/settings/');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const createQuote = (leadId: number) => {
    // Placeholder for quote creation
    alert(`Crear cotización para lead ${leadId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Panel de Administración
          </h1>
          <p className="text-xl text-gray-600">
            Gestión de eventos de Karina Ocampo
          </p>
        </div>

        {/* Leads Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Leads recientes
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Consultas de clientes potenciales
            </p>
          </div>
          <ul className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <li key={lead.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {lead.contact_name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {lead.status || 'Nuevo'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {lead.contact_email}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          {lead.event_type} - {lead.num_guests} invitados
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {lead.event_date && new Date(lead.event_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => createQuote(lead.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                      Crear Cotización
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Settings Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Configuración de la Aplicación
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Configuraciones generales del sistema
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Porcentaje de seña por defecto
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    value={settings.default_deposit_percentage * 100}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border"
                    readOnly
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Actualmente configurado al {(settings.default_deposit_percentage * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Zonas de cobertura
                </label>
                <div className="mt-1">
                  <div className="flex flex-wrap gap-2">
                    {settings.coverage_zones.map((zone, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Inventario de Equipos
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        Gestionar equipos
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  Ver inventario
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Documentos y Contratos
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        Gestionar documentos
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  Ver documentos
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Asignaciones de Equipos
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        Asignar equipos a eventos
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  Ver asignaciones
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}