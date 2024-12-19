import { NextRequest, NextResponse } from 'next/server';

export function middleware(req) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  return NextResponse.next();
}