import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // No middleware for now to avoid import issues
  return
}

export const config = {
  matcher: [],
}
