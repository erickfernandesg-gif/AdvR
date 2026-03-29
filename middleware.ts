import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, we'll just let it pass or implement a basic check if needed.
  // In a real app with Supabase, you'd use @supabase/ssr to check the session here.
  // Since we don't have @supabase/ssr installed, we'll rely on client-side or layout checks,
  // or just let it pass for the demo if Supabase is not fully configured.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
