import { NextResponse } from 'next/server';
import YTMusicAPI from 'lite-ytmusic-api';

const ytmusic = new YTMusicAPI();
let initialized = false;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (!q) {
    return NextResponse.json({ error: 'Missing query parameter "q"' }, { status: 400, headers });
  }

  try {
    if (!initialized) {
      await ytmusic.initialize();
      initialized = true;
    }
    
    const data = await ytmusic.searchSongs(q);
    return NextResponse.json(data, { headers });
  } catch (error: any) {
    console.error('Error searching songs:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
