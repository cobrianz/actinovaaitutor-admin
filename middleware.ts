import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if accessing admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Exclude auth routes (login, signup, verify, forgot-password)
        // Also likely next-auth routes if used, but we use custom.
        if (request.nextUrl.pathname.startsWith('/admin/auth')) {
            return NextResponse.next()
        }

        const token = request.cookies.get('adminToken')?.value

        if (!token) {
            const loginUrl = new URL('/admin/auth/login', request.url)
            // Optional: Add redirect param
            // loginUrl.searchParams.set('from', request.nextUrl.pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export default middleware;

export const config = {
    matcher: '/admin/:path*',
}
