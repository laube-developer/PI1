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
    <div style={{ maxWidth: 420, margin: '60px auto', padding: 20 }}>
      <h1>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h1>

      <form onSubmit={handleSubmit}>
        <label>Email</label><br/>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required /><br/>

        <label>Senha</label><br/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required /><br/><br/>

        <button type="submit" disabled={loading}>
          {loading ? 'Aguarde...' : (mode === 'login' ? 'Entrar' : 'Cadastrar')}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <hr />
      <p>
        {mode === 'login' ? "Não tem conta?" : "Já tem conta?"}
        {' '}
        <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Criar conta' : 'Entrar'}
        </button>
      </p>
    </div>
  )
}
