'use client';

import { useEffect, useState } from 'react';

interface InstagramPost {
  id: string;
  caption: string;
  media_url: string;
  permalink: string;
  timestamp: string;
}

export default function Home() {
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramFeed = async () => {
      try {
        // NOTE: Using a placeholder for the API endpoint
        const response = await fetch('http://localhost:8000/api/social/instagram/feed');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: InstagramPost[] = await response.json();
        setInstagramPosts(data);
      } catch (e: any) {
        console.error("Failed to fetch instagram feed:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramFeed();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Karina Ocampo Cantante</h1>
      <p>Landing Page</p>

      <section className="mt-12 w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Nuestro Instagram</h2>
        {
          loading ? (
            <p className="text-center">Cargando posts de Instagram...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error al cargar el feed de Instagram. Por ahora, esta es una funcionalidad de demostración.</p>
          ) : instagramPosts.length === 0 ? (
            <p className="text-center">No hay posts de Instagram para mostrar.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instagramPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={post.media_url} alt={post.caption} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <p className="text-gray-700 text-sm mb-2 line-clamp-2">{post.caption}</p>
                    <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Ver en Instagram</a>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </section>
    </main>
  );
}

