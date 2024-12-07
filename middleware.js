import { NextResponse } from 'next/server';

export async function middleware(req) {
  if (req.method === 'POST' && req.headers.get('content-type') === 'application/json') {
    const body = await req.json();
    console.log('Parsed JSON body:', body);
    req.body = body;
  }

  return NextResponse.next();
}