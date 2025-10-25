// app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../..//lib/supabaseClient'

interface User {
  email: string
  // adicione outros campos do usuário se precisar
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // pega sessão atual
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login')
      } else {
        setUser(data.session.user as User)
      }
    })

    // escuta mudanças de auth (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login')
      else setUser(session.user as User)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

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
