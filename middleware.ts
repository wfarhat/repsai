import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define routes that should remain public
const isPublicRoute = createRouteMatcher(['/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // If the route is public, allow access without requiring authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect other routes - redirect unauthenticated users to sign-in
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always apply middleware to API routes
    '/(api|trpc)(.*)',
  ],
};
