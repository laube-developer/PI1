import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('login') // 'login' ou 'signup'
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      setLoading(false)
      if (error) return setError(error.message)
      router.push('/dashboard') // redireciona ao logar
    } else {
      // cadastrar
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      setLoading(false)
      if (error) return setError(error.message)
      // o Supabase pode enviar email de confirmação dependendo das configs
      setError('Conta criada! Verifique seu e-mail se for necessário confirmar.')
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
        <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Criar conta' : 'Entrar'}
        </button>
      </p>
    </div>
  )
}
