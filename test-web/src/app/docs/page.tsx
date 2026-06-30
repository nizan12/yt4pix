'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DocsPage() {
  const [origin, setOrigin] = useState('http://localhost:3000');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const [searchQuery, setSearchQuery] = useState('never gonna give you up');
  const [searchResponse, setSearchResponse] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const [upnextId, setUpnextId] = useState('dQw4w9WgXcQ');
  const [upnextResponse, setUpnextResponse] = useState<any>(null);
  const [upnextLoading, setUpnextLoading] = useState(false);

  const testSearch = async () => {
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResponse(data);
    } catch (err) {
      setSearchResponse({ error: 'Failed to fetch' });
    }
    setSearchLoading(false);
  };

  const testUpNext = async () => {
    setUpnextLoading(true);
    try {
      const res = await fetch(`/api/upnext?id=${encodeURIComponent(upnextId)}`);
      const data = await res.json();
      setUpnextResponse(data);
    } catch (err) {
      setUpnextResponse({ error: 'Failed to fetch' });
    }
    setUpnextLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>API Documentation</h1>
          <p style={{ color: '#aaaaaa' }}>Panduan integrasi dan testing untuk Endpoint API Musik.</p>
        </div>
        <Link href="/" style={{ padding: '0.6rem 1.2rem', background: '#333', borderRadius: '20px', fontWeight: 600 }}>
          ← Back to App
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Endpoint: Search */}
        <div style={{ background: '#181818', padding: '2rem', borderRadius: '12px', border: '1px solid #303030' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ background: '#2563eb', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '8px', fontWeight: 'bold' }}>GET</span>
            <code style={{ fontSize: '1.2rem', color: '#60a5fa' }}>/api/search</code>
          </div>
          <p style={{ marginBottom: '1.5rem', color: '#cccccc' }}>Mencari lagu atau video berdasarkan kata kunci (query).</p>
          
          <h3 style={{ marginBottom: '0.5rem' }}>Query Parameters:</h3>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', color: '#aaaaaa' }}>
            <li><strong>q</strong> (string, wajib) - Kata kunci pencarian.</li>
          </ul>

          <h3 style={{ marginBottom: '0.5rem' }}>Full URL Example:</h3>
          <div style={{ background: '#0a0a0a', padding: '1rem', borderRadius: '8px', border: '1px solid #333', marginBottom: '1.5rem', fontFamily: 'monospace', color: '#a78bfa' }}>
            {origin}/api/search?q=obh+combi
          </div>

          <div style={{ background: '#0a0a0a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #222' }}>
            <h4 style={{ marginBottom: '1rem' }}>Live Test:</h4>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #333', background: '#111', color: 'white' }}
                placeholder="Masukkan kata kunci..."
              />
              <button 
                onClick={testSearch}
                style={{ padding: '0.8rem 1.5rem', background: 'white', color: 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {searchLoading ? 'Loading...' : 'Send Request'}
              </button>
            </div>
            
            {searchResponse && (
              <div>
                <h4 style={{ marginBottom: '0.5rem', color: '#aaaaaa' }}>Response:</h4>
                <pre style={{ background: '#111', padding: '1rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid #222', maxHeight: '300px', fontSize: '0.9rem' }}>
                  {JSON.stringify(searchResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Endpoint: Up Next */}
        <div style={{ background: '#181818', padding: '2rem', borderRadius: '12px', border: '1px solid #303030' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ background: '#2563eb', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '8px', fontWeight: 'bold' }}>GET</span>
            <code style={{ fontSize: '1.2rem', color: '#60a5fa' }}>/api/upnext</code>
          </div>
          <p style={{ marginBottom: '1.5rem', color: '#cccccc' }}>Mendapatkan antrean daftar putar (queue) berikutnya dari sebuah video/lagu.</p>
          
          <h3 style={{ marginBottom: '0.5rem' }}>Query Parameters:</h3>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', color: '#aaaaaa' }}>
            <li><strong>id</strong> (string, wajib) - ID Video YouTube.</li>
          </ul>

          <h3 style={{ marginBottom: '0.5rem' }}>Full URL Example:</h3>
          <div style={{ background: '#0a0a0a', padding: '1rem', borderRadius: '8px', border: '1px solid #333', marginBottom: '1.5rem', fontFamily: 'monospace', color: '#a78bfa' }}>
            {origin}/api/upnext?id=dQw4w9WgXcQ
          </div>

          <div style={{ background: '#0a0a0a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #222' }}>
            <h4 style={{ marginBottom: '1rem' }}>Live Test:</h4>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input 
                type="text" 
                value={upnextId}
                onChange={(e) => setUpnextId(e.target.value)}
                style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #333', background: '#111', color: 'white' }}
                placeholder="Masukkan Video ID..."
              />
              <button 
                onClick={testUpNext}
                style={{ padding: '0.8rem 1.5rem', background: 'white', color: 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {upnextLoading ? 'Loading...' : 'Send Request'}
              </button>
            </div>
            
            {upnextResponse && (
              <div>
                <h4 style={{ marginBottom: '0.5rem', color: '#aaaaaa' }}>Response:</h4>
                <pre style={{ background: '#111', padding: '1rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid #222', maxHeight: '300px', fontSize: '0.9rem' }}>
                  {JSON.stringify(upnextResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
