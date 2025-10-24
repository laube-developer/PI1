// pages/dashboard.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // pega sessão atual
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login')
      } else {
        setUser(data.session.user)
      }
    })

    // opcional: escuta mudanças de auth (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login')
      else setUser(session.user)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return <p>Verificando sessão...</p>

  return (
    <div style={{ maxWidth: 640, margin: '40px auto' }}>
      <h1>Bem-vindo, {user.email}</h1>
      <p>Área privada do seu app.</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  )
}
