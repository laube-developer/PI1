// app/dashboard/page.tsx
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
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

interface User {
  email: string
  // adicione outros campos do usuário se precisar
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

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const adicionarAndar = ()=>{

    const novoComando: Andar = {id: crypto.randomUUID(),tipo: "Andar", distancia: 0}
    
    setComandos([...comandos, novoComando])
  }

  const adicionarVirar = ()=>{
    const novoComando: Virar = {id: crypto.randomUUID(),tipo: "Virar", lado: "Esquerda"}

    setComandos([...comandos, novoComando])
  }

  const alterarDistancia = (id: number, distancia: number)=>{
    const novoComando: Andar = {id: crypto.randomUUID(),tipo: "Andar", distancia: distancia}
    const novoArray = [...comandos]
    
    novoArray[id] = novoComando

    setComandos(novoArray)
  }

  const mudarDirecao = (id: number, lado: string)=>{
    if (lado != "Esquerda" && lado != "Direita"){
      return;
    }

    const novoComando: Virar = {id: crypto.randomUUID(),tipo: "Virar", lado: lado}
    const novoArray = [...comandos]
    
    novoArray[id] = novoComando

    setComandos(novoArray)
  }

  const adicionarLargar = () => {

    const novoComando: Largar = {id: crypto.randomUUID(),tipo: "Largar"}
    setComandos([...comandos, novoComando])
  }

  const removerComando = (id: number) => {
    if (id > comandos.length -1) return

    const novoArray = [...comandos]
    novoArray.splice(id, 1)

    setComandos(novoArray)
  }

  const handleEnviar = () => {
    if (!sidebarState.isConnected) {
        alert("Conecte-se ao carrinho para enviar os comandos");
        return;
    } else if(comandos.length == 0) {
      alert("Nenhum comando foi inserido!");
      return;
    }
    
    console.log("Comandos enviados!");
  }

  if (!user) return <p>Verificando sessão...</p>

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar handleLogout={handleLogout} sidebarState={sidebarState} setSideBarState={setSidebarState} handleEnviar={handleEnviar}/>

      {/* Main content */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center bg-slate-200">

        {!comandos.length && (<>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Bem-vindo, {user.email}
          </h1>
          <p className="text-gray-700 mb-6 text-center">Sem comandos adicionados. Adicione-os no menu de comandos!.</p>
        </>)}

        {comandos.length > 0 && (
          <DragDropContext
            onDragEnd={(result: DropResult) => {
              if (!result.destination) return

              const novaOrdem = Array.from(comandos)
              const [removido] = novaOrdem.splice(result.source.index, 1)
              novaOrdem.splice(result.destination.index, 0, removido)

              setComandos(novaOrdem)
            }}
          >
            <div className='flex flex-row gap-2 items-start'>
              <div className='w-max flex flex-col gap-3 justify-center px-5'>
                <p className='font-bold'>Início</p>
              </div>

              <Droppable droppableId="comandos" direction="horizontal">
                {(provided) => (
                  <div
                    className="flex flex-row gap-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {comandos.map((comando, id) => (
                      <Draggable key={comando.id} draggableId={comando.id} index={id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className='w-30 bg-white p-4 rounded-md shadow flex flex-col gap-3 cursor-move'
                          >
                            <div className='flex flex-row justify-between'>
                              <p className='font-bold'>{comando.tipo}</p>
                              <Button icon={IoMdClose} color='error' handleClick={()=> removerComando(id)} className="w-max p-2"/>
                            </div>

                            {comando.tipo == "Andar" && (
                              <div className='flex flex-row gap-2 items-center'>
                                <input
                                  value={comando.distancia}
                                  onChange={(event)=> alterarDistancia(id, Number(event.target.value))}
                                  type='number'
                                  className='w-full bg-slate-200 rounded-md p-1 w-35'
                                />
                                <p>cm</p>
                              </div>
                            )}

                            {comando.tipo == "Virar" && (
                              <div className='flex flex-row gap-2 items-center'>
                                <select
                                  value={comando.lado}
                                  onChange={(event) => mudarDirecao(id, event.target.value)}
                                >
                                  <option value="Direita">Direita</option>
                                  <option value="Esquerda">Esquerda</option>
                                </select>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <div className='w-max flex flex-col gap-3 justify-center px-5'>
                <p className='font-bold'>Fim</p>
              </div>
            </div>
          </DragDropContext>
        )}

        {/* <div>
          <p className='font-bold'>Comandos: </p>
          <p>{JSON.stringify(comandos)}</p>
        </div> */}

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
