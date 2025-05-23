import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  if (pathname.includes('/auth') || token) {
    return NextResponse.next();
  }

  if (!token && pathname === '/auth/login') {
    return NextResponse.redirect('/auth/login');
  }

  if (!token) {
    return NextResponse.redirect('/auth/login');
  }
}

export default middleware;  