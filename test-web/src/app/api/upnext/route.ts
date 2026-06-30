import { NextResponse } from 'next/server';
import YTMusicAPI from 'lite-ytmusic-api';

const ytmusic = new YTMusicAPI();
let initialized = false;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (!id) {
    return NextResponse.json({ error: 'Missing query parameter "id"' }, { status: 400, headers });
  }

  try {
    if (!initialized) {
      await ytmusic.initialize();
      initialized = true;
    }
    
    const data = await ytmusic.getUpNexts(id);
    return NextResponse.json(data, { headers });
  } catch (error: any) {
    console.error('Error getting up next:', error);
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
