// app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('Conta criada! Verifique seu e-mail se for necessário confirmar.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-gray-300 rounded-xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <img
          src="/carrodoovo.png"
          alt="Logo Carro do Ovo"
          className="w-20 h-20 mb-4 rounded-full object-cover"
        />
        <h1 className="text-2xl font-bold mb-6">{mode === 'login' ? 'Entrar' : 'Criar Conta'}</h1>

        <form className="w-full" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-3 mb-4 rounded-lg border border-gray-400 focus:border-blue-500 focus:outline-none transition"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Senha"
            required
            className="w-full p-3 mb-4 rounded-lg border border-gray-400 focus:border-blue-500 focus:outline-none transition"
          />

          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-6 text-sm">
          {mode === 'login' ? "Não tem conta?" : "Já tem conta?"}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-blue-600 font-medium hover:underline"
          >
            {mode === 'login' ? 'Criar conta' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  )
}
