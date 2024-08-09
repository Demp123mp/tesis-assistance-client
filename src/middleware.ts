import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export function middleware(request: NextRequest) {
  const jwt = cookies().get("myqk")
  if (!request.nextUrl.pathname.includes("/auth")) {
    if (jwt === undefined) {
      const url = new URL("/", request.nextUrl)
      return NextResponse.redirect(url)
    }
  }
  if (request.nextUrl.pathname === "/") {
    if (jwt === undefined) {
      const url = new URL("/", request.nextUrl)
      return NextResponse.redirect(url)
    } else {
      const url = new URL("/dashboard", request.nextUrl)
      return NextResponse.redirect(url)
    }
  }
  if (request.nextUrl.pathname === "/" && jwt) {
    const url = new URL("/dashboard", request.nextUrl)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
