import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">Karina Ocampo</Link>
        <div className="space-x-4">
          <Link href="/paquetes" className="text-gray-300 hover:text-white">Paquetes</Link>
          <Link href="/contacto" className="text-gray-300 hover:text-white">Contacto</Link>
          <Link href="/admin" className="text-gray-300 hover:text-white">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
