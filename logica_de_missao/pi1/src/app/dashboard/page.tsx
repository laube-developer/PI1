'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../..//lib/supabaseClient'
import Sidebar from '../../../components/Sidebar'
import ComandoButton from '../../../components/ComandoButton'
import { FaLongArrowAltUp } from 'react-icons/fa'
import { HiArrowUturnRight } from 'react-icons/hi2'
import { BsBoxSeamFill } from 'react-icons/bs'
import { Andar, Comando, comandos_aceitos, Largar, Virar } from '../../../interfaces/comandos'
import Button from '../../../components/Button'
import { IoMdClose } from 'react-icons/io'
import CodeView from '../../../components/CodeView' // Agora é um Client Component

interface User {
  email: string
}

interface ComandoSalvo {
  tipo: comandos_aceitos;
  distancia?: number; 
  direcao?: 'Direita' | 'Esquerda';
}


export type SideBarStateProps = {
  isConnected: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarState, setSidebarState] = useState<SideBarStateProps>({
    isConnected: false
  })

  const [comandos, setComandos] = useState<Comando[]>([])
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login')
      } else {
        setUser(data.session.user as User)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login')
      else setUser(session.user as User)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  //Carrega os comando salvos da sessão anterior
  useEffect(()=>{
    const comandosSalvosNoNavegador: ComandoSalvo[] = JSON.parse(localStorage.getItem('comandos') || "[]");

    const reidratarComando = (objeto: ComandoSalvo): Comando | null => {
      switch (objeto.tipo) {
        case "Andar":
          // Garante que 'distancia' é um número
          return new Andar(objeto.distancia ?? 0);
        case "Virar":
          // Garante que 'direcao' é um valor aceito, ou usa um padrão
          const direcao = (objeto.direcao === 'Direita' || objeto.direcao === 'Esquerda') ? objeto.direcao : 'Esquerda';
          return new Virar(direcao);
        case "Largar":
          return new Largar();

        default:
          console.error("Tipo de comando desconhecido", objeto.tipo);
          return null;
      }
    }

    const comandosReidratados = comandosSalvosNoNavegador
    .map(reidratarComando)
    .filter((comando): comando is Comando => comando !== null)

    setComandos(comandosReidratados);
  }, [])

  //Salva os comandos no localStorage para o usuário continuar os comandos 
  //mesmo após a sessão ser finalizada
  useEffect(()=> {
    localStorage.setItem('comandos', JSON.stringify(comandos));
  }, [comandos])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const adicionarAndar = ()=>{
    const novoComando = new Andar(0)
    setComandos([...comandos, novoComando])
  }

  const adicionarVirar = ()=>{
    const novoComando = new Virar("Esquerda")
    setComandos([...comandos, novoComando])
  }

  const alterarDistancia = (id: number, distancia: number)=>{
    const novoComando = new Andar(distancia);
    const novoArray = [...comandos];
    
    novoArray[id] = novoComando;

    setComandos(novoArray);
  }

  const mudarDirecao = (id: number, direcao: string)=>{
    if (direcao != "Esquerda" && direcao != "Direita"){
      return;
    }

    const novoComando = new Virar(direcao as 'Direita' | 'Esquerda');
    const novoArray = [...comandos];
    
    novoArray[id] = novoComando;

    setComandos(novoArray);
  }

  const adicionarLargar = () => {
    const novoComando = new Largar();
    setComandos([...comandos, novoComando])
  }

  const removerComando = (id: number) => {
    if (id > comandos.length -1) return;

    const novoArray = [...comandos];
    novoArray.splice(id, 1);

    setComandos(novoArray);
  }

  if (!user) return <p>Verificando sessão...</p>

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar handleLogout={handleLogout} sidebarState={sidebarState} setSideBarState={setSidebarState}/>

      {/* Main content */}
      <main className="flex-1 p-6 flex flex-row items-center justify-center bg-slate-200 relative">

        {!comandos.length && (<div className='flex flex-col items-center'>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Bem-vindo, {user.email}
          </h1>
          <p className="text-gray-700 mb-6 text-center">Sem comandos adicionados. Adicione-os no menu de comandos!.</p>
        </div>)}

        {comandos.length > 0 && (
          <div className='w-50 mt-8 absolute bottom-2 left-2'>
            <CodeView code={JSON.stringify(comandos, null, 2)}></CodeView>
          </div>
        )}

        {comandos.length > 0 && (
          <div className='flex flex-row gap-2'>
            <div className='w-max flex flex-col gap-3 justify-center px-5'>
                <p className='font-bold'>Início</p>

            </div>

            {comandos.map((comando, id) => (
              <div className='w-30 bg-white p-4 rounded-md shadow flex flex-col gap-3' key={`comando_${id}`}>
                <div className='flex flex-row justify-between'>
                  <p className='font-bold'>{comando.tipo}</p>
                  <Button icon={IoMdClose} color='error' handleClick={()=> removerComando(id)} className="w-max p-2"/>
                </div>

                {comando instanceof Andar && (<div className='flex flex-row gap-2 items-center'>
                  <input value={comando.distancia} onChange={(event)=> alterarDistancia(id, Number(event.target.value))} placeholder='distância...' type='number' className='w-full bg-slate-200 rounded-md p-1 w-35'/>
                  <p>cm</p>
                </div>)}

                {comando instanceof Virar && (<div className='flex flex-row gap-2 items-center'>
                  {/* Corrigido: usando comando.direcao que é a propriedade da classe Virar */}
                  <select value={comando.direcao} onChange={(event) => mudarDirecao(id, event.target.value)}>
                    <option defaultChecked value="Direita">Direita</option>
                    <option value="Esquerda">Esquerda</option>
                  </select>
                </div>)}
                

              </div>
            ))}

            <div className='w-max flex flex-col gap-3 justify-center px-5'>
                <p className='font-bold'>Fim</p>

            </div>
          </div>
        )}

        {/* Comandos à direita */}
        <div className="fixed bottom-6 right-6 bg-gray-300 p-4 rounded-xl flex flex-col space-y-2">
            <span className="font-bold text-gray-900 mb-2 text-center">COMANDOS</span>
            <ComandoButton icon={FaLongArrowAltUp} iconPos='right' handleClick={adicionarAndar}>
              Andar
            </ComandoButton>

            <ComandoButton icon={HiArrowUturnRight} iconPos='right' handleClick={adicionarVirar}>
              Virar
            </ComandoButton>

            <ComandoButton icon={BsBoxSeamFill } iconPos='right' handleClick={adicionarLargar}>
              Largar
            </ComandoButton>
        </div>
        </main>
    </div>
  )
}
