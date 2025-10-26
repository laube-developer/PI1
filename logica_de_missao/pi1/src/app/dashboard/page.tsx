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
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-20 md:w-24 bg-gray-300 flex flex-col items-center py-6 space-y-4 border-r border-gray-400">
        <div className="flex flex-col items-center space-y-2">
          <img
            src="/carrodoovo.png"
            alt="Logo Carro do Ovo"
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="text-xs font-bold text-gray-900 text-center">CARRO DO OVO</span>
        </div>

        <button className="w-12 md:w-16 bg-gray-200 hover:bg-gray-400 text-gray-900 py-2 rounded-lg text-xs flex items-center justify-center">
          Conectar
        </button>

        <button className="w-12 md:w-16 bg-gray-500 text-white py-2 rounded-lg text-xs flex items-center justify-center">
          Enviar
        </button>

        <button className="w-12 md:w-16 bg-gray-200 hover:bg-gray-400 text-gray-900 py-2 rounded-lg text-xs flex items-center justify-center">
          Histórico
        </button>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-12 md:w-16 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-xs flex items-center justify-center"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Bem-vindo, {user.email}
        </h1>
        <p className="text-gray-700 mb-6 text-center">Sem comandos adicionados. Adicione-os no menu de comandos!.</p>

        {/* Comandos à direita */}
        <div className="fixed bottom-6 right-6 bg-gray-300 p-4 rounded-xl flex flex-col space-y-2">
            <span className="font-bold text-gray-900 mb-2 text-center">COMANDOS</span>
            <button className="bg-white hover:bg-gray-200 py-2 px-4 rounded flex items-center justify-between">
            Andar <span>↑</span>
            </button>
            <button className="bg-white hover:bg-gray-200 py-2 px-4 rounded flex items-center justify-between">
            Virar <span>↩</span>
            </button>
            <button className="bg-white hover:bg-gray-200 py-2 px-4 rounded flex items-center justify-between">
            Largar <span>◯</span>
            </button>
        </div>
        </main>
    </div>
  )
}
