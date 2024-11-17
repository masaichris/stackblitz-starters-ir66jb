import { Metadata } from 'next'
import Login from '@/components/Login'

export const metadata: Metadata = {
  title: 'Login - Mobile Money Management',
  description: 'Login to access the Mobile Money Management system',
}

export default function LoginPage() {
  return <Login />
}