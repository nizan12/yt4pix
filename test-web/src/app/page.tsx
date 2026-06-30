'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  // Up Next state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upNextData, setUpNextData] = useState<any[]>([]);
  const [isLoadingUpNext, setIsLoadingUpNext] = useState(false);
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');

  // Player state
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setError('');
    
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (res.ok) {
        setResults(data);
      } else {
        setError(data.error || 'Failed to search songs');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpNext = async (videoId: string, title: string) => {
    setIsModalOpen(true);
    setIsLoadingUpNext(true);
    setUpNextData([]);
    setCurrentVideoTitle(title);

    try {
      const res = await fetch(`/api/upnext?id=${videoId}`);
      const data = await res.json();
      
      if (res.ok) {
        setUpNextData(data);
      } else {
        console.error('Error fetching up next:', data.error);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingUpNext(false);
    }
  };

  return (
    <main className="container">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>YT Music Explorer</h1>
          <p>A beautiful web app to test lite-ytmusic-api</p>
        </div>
        <Link href="/docs" style={{ padding: '0.6rem 1.2rem', background: '#333', borderRadius: '20px', fontWeight: 600 }}>
          API Docs ➔
        </Link>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-box">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for songs, artists, or albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      {isLoading && <div className="loader"></div>}

      {error && <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: '2rem' }}>{error}</div>}

      {!isLoading && hasSearched && results.length === 0 && !error && (
        <div className="empty-state">No results found for "{query}"</div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="results-container">
          {(() => {
            const topItem = results[0];
            const videoId = topItem.videoId;
            const title = topItem.name || topItem.title;
            const artist = Array.isArray(topItem.artists) 
              ? topItem.artists.map((a: any) => a.name).join(', ') 
              : (typeof topItem.artists === 'string' ? topItem.artists : (topItem.author?.name || 'Unknown Artist'));
            const thumbnail = topItem.thumbnails?.[0]?.url || topItem.thumbnail?.url || (typeof topItem.thumbnail === 'string' ? topItem.thumbnail : null);
            const typeText = topItem.type === 'SONG' ? 'Lagu' : 'Video';
            const duration = topItem.duration ? ` • ${topItem.duration}` : '';
            
            return (
              <div className="top-result-card" onClick={() => setPlayingVideoId(videoId)}>
                {thumbnail ? (
                  <img src={thumbnail} alt={title} className="top-thumbnail" />
                ) : (
                  <div className="top-thumbnail" style={{ background: '#333' }}></div>
                )}
                <div className="top-content">
                  <div className="top-title">{title}</div>
                  <div className="top-subtitle">{typeText} • {artist}{duration}</div>
                  
                  <div className="top-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="btn-play" onClick={() => setPlayingVideoId(videoId)}>
                      ▶ Putar
                    </button>
                    <button className="btn-upnext" onClick={() => handleUpNext(videoId, title)}>
                      <span style={{ fontSize: '1.2rem' }}>≡</span> Up Next
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            {results.slice(1).map((item, index) => {
              const videoId = item.videoId;
              const title = item.name || item.title;
              const artist = Array.isArray(item.artists) 
                ? item.artists.map((a: any) => a.name).join(', ') 
                : (typeof item.artists === 'string' ? item.artists : (item.author?.name || 'Unknown Artist'));
              const thumbnail = item.thumbnails?.[0]?.url || item.thumbnail?.url || (typeof item.thumbnail === 'string' ? item.thumbnail : null);
              const typeText = item.type === 'SONG' ? 'Lagu' : 'Video';
              const duration = item.duration ? ` • ${item.duration}` : '';
              
              if (!videoId) return null;

              return (
                <div className="list-item" key={videoId + index} onClick={() => setPlayingVideoId(videoId)}>
                  <div className="list-thumbnail-container">
                    {thumbnail ? (
                      <img src={thumbnail} alt={title} className="list-thumbnail" />
                    ) : (
                      <div className="list-thumbnail" style={{ background: '#333' }}></div>
                    )}
                  </div>
                  <div className="list-content">
                    <div className="list-title">{title}</div>
                    <div className="list-subtitle">{typeText} • {artist}{duration}</div>
                  </div>
                  <div className="list-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="btn-upnext" onClick={() => handleUpNext(videoId, title)} style={{ border: 'none' }}>
                      Up Next
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Up Next Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Up Next</div>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Playing next after: <strong style={{ color: 'white' }}>{currentVideoTitle}</strong>
              </p>
              
              {isLoadingUpNext ? (
                <div className="loader"></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {upNextData.map((item, idx) => {
                    const title = item.title;
                    const artist = Array.isArray(item.artists) 
                      ? item.artists.map((a: any) => a.name).join(', ') 
                      : (typeof item.artists === 'string' ? item.artists : (item.author?.name || 'Unknown Artist'));
                    const thumbnail = item.thumbnails?.[0]?.url || item.thumbnail?.url || (typeof item.thumbnail === 'string' ? item.thumbnail : null);
                    
                    return (
                      <div className="upnext-item" key={item.videoId || idx}>
                        {thumbnail ? (
                          <img src={thumbnail} className="upnext-thumb" alt="thumb" />
                        ) : (
                          <div className="upnext-thumb" style={{ background: '#334155' }}></div>
                        )}
                        <div className="upnext-info">
                          <div className="upnext-title">{title}</div>
                          <div className="upnext-artist">{artist}</div>
                        </div>
                        <button 
                          className="btn-play-small"
                          onClick={() => setPlayingVideoId(item.videoId)}
                        >
                          ▶
                        </button>
                      </div>
                    );
                  })}
                  
                  {upNextData.length === 0 && (
                    <div className="empty-state" style={{ padding: '2rem 0' }}>No up next data found.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* YouTube Bottom Player */}
      {playingVideoId && (
        <div className="bottom-player">
          <div className="bottom-player-inner">
            <iframe
              src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ width: '100%', height: '100px' }}
            ></iframe>
            <button className="close-player-btn" onClick={() => setPlayingVideoId(null)}>✕</button>
          </div>
        </div>
      )}
    </main>
  );
}
