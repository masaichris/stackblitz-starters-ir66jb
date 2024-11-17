import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { handleError } from '@/lib/api-utils'
import bcrypt from 'bcryptjs'

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = loginSchema.parse(body)

    // For demo purposes, using hardcoded credentials
    // In production, validate against database
    if (username === 'admin' && password === 'admin') {
      const token = await new SignJWT({ 
        id: '1',
        username: 'admin',
        role: 'admin'
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret'))

      const response = NextResponse.json({
        success: true,
        user: {
          id: '1',
          username: 'admin',
          role: 'admin'
        }
      })

      // Set HTTP-only cookie
      response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return handleError(error)
  }
}