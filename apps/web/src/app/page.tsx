"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-16">

        {/* Auth status */}
        <div className="absolute top-4 right-4 flex items-center space-x-4">
            {isAuthenticated && user ? (
                <>
                    <p className="text-sm">Welcome, {user.email}</p>
                    <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-semibold">Logout</button>
                </>
            ) : (
                <>
                    <Link href="/login" className="hover:text-pink-400">Login</Link>
                    <Link href="/register" className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-md text-sm font-semibold">Register</Link>
                </>
            )}
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Karina Ocampo
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-4">
            Entretenimiento para Eventos
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Sistema de gestión y ventas para eventos con música en vivo, karaoke y animación profesional
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Link href="/contacto" className="group">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-all duration-300 group-hover:scale-105 shadow-2xl">
              <div className="text-4xl mb-4">📝</div>
              <h2 className="text-2xl font-bold mb-3">Solicitar Cotización</h2>
              <p className="text-gray-300">
                Completa el formulario para recibir una cotización personalizada para tu evento
              </p>
            </div>
          </Link>

          {/* Admin Panel */}
          {isAuthenticated && user?.role === UserRole.ADMIN && (
            <Link href="/admin" className="group">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-all duration-300 group-hover:scale-105 shadow-2xl">
                <div className="text-4xl mb-4">⚙️</div>
                <h2 className="text-2xl font-bold mb-3">Panel de Administración</h2>
                <p className="text-gray-300">
                  Gestiona leads, cotizaciones, inventario y configuraciones del sistema
                </p>
              </div>
            </Link>
          )}

          {/* Karaoke Demo */}
          <Link href="/karaoke/demo/public" className="group">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-all duration-300 group-hover:scale-105 shadow-2xl">
              <div className="text-4xl mb-4">🎤</div>
              <h2 className="text-2xl font-bold mb-3">Karaoke Demo</h2>
              <p className="text-gray-300">
                Vista de demostración del sistema de karaoke para eventos
              </p>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-200">
            Características del Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/5 rounded-lg p-6">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-semibold mb-2">Gestión de Leads</h3>
              <p className="text-sm text-gray-400">
                Captura y seguimiento de clientes potenciales
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="text-lg font-semibold mb-2">Sistema Karaoke</h3>
              <p className="text-sm text-gray-400">
                Cola de canciones en tiempo real
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-lg font-semibold mb-2">Inventario</h3>
              <p className="text-sm text-gray-400">
                Control de equipos y asignaciones
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="text-lg font-semibold mb-2">Documentos</h3>
              <p className="text-sm text-gray-400">
                Gestión de contratos y archivos
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-6 text-gray-300">
            Enlaces Rápidos
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/karaoke/demo/host" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-colors"
            >
              Consola Karaoke Demo
            </Link>
            <a 
              href="http://localhost:8000/docs" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors"
            >
              API Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
