"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../..//lib/supabaseClient'
import Sidebar from '../../../components/Sidebar'
import ComandoButton from '../../../components/ComandoButton'
import { FaLongArrowAltUp } from 'react-icons/fa'
import { HiArrowUturnRight } from 'react-icons/hi2'
import { BsBoxSeamFill } from 'react-icons/bs'
import { Andar, Comando, Virar } from '../../../entidades/comandos'
import Button from '../../../components/Button'
import { IoMdClose } from 'react-icons/io'
import CodeView from '../../../components/CodeView' // Agora é um Client Component
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { AppState } from '../../../entidades/appstate'
import { User } from '../../../entidades/user'
import { enviarMensagem } from '../../../actions/actions'


export default function DashboardPage() {
  const [modelState, setModelState] = useState<AppState>(new AppState())

  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login')
      } else {
        setModelState(modelState.setUser(data.session.user as User))
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login')
      else setModelState(modelState.setUser(session.user as User))
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  useEffect(()=> {
    localStorage.setItem('comandos', JSON.stringify(modelState.comandos));
  }, [modelState.comandos])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const adicionarAndar = ()=>{
    setModelState(modelState.adicionarAndar())
  }

  const adicionarVirar = ()=>{
    setModelState(modelState.adicionarVirar())
  }

  const adicionarLargar = ()=>{
    setModelState(modelState.adicionarLargar())
  }

  const handleEnviar = () => {
    if (modelState.conexaoEstado() !== "conectado") {
        alert("Conecte-se ao carrinho para enviar os comandos");
        return;
    }
    
    if (modelState.comandos().length == 0) {
      alert("Nenhum comando foi inserido!");
      return;
    }

    enviarMensagem("carrodoovo/comandos", JSON.stringify(modelState.comandos()));
    
    console.log("Comandos enviados!");
  }

  if (!modelState.user()) return <p>Verificando sessão...</p>

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar handleLogout={handleLogout} modelState={modelState} setModelState={setModelState} handleEnviar={handleEnviar}/>

      {/* Main content */}
      <main className="flex-1 p-6 flex flex-row items-center justify-center bg-slate-200 relative">

        {!modelState.comandos().length && (<div className='flex flex-col items-center'>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Bem-vindo, {modelState.user()?.email}
          </h1>
          <p className="text-gray-700 mb-6 text-center">Sem comandos adicionados. Adicione-os no menu de comandos!.</p>
        </div>)}

        {modelState.comandos().length > 0 && (
          <div className='w-50 mt-8 absolute bottom-2 left-2'>
            <CodeView code={JSON.stringify(modelState.comandos(), null, 2)}></CodeView>
          </div>
        )}

        {modelState.comandos().length > 0 && (
          <DragDropContext
            onDragEnd={(result: DropResult) => {
              if (!result.destination) return

              const novaOrdem = Array.from(modelState.comandos())
              const [removido] = novaOrdem.splice(result.source.index, 1)
              novaOrdem.splice(result.destination.index, 0, removido)

              setModelState(modelState.atualizarListaComandos(novaOrdem))
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
                    data-testid="command-list"
                  >
                    {modelState.comandos().map((comando, id) => (
                      <Draggable key={comando.id} draggableId={comando.id} index={id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            data-testid={`command-card-${id}`}
                            className='w-30 bg-white p-4 rounded-md shadow flex flex-col gap-3 cursor-move'
                          >
                            <div className='flex flex-row justify-between'>
                              <p className='font-bold'>{comando.tipo}</p>
                              <Button
                                handleClick={()=> setModelState(modelState.removerComando(id))}
                                icon={IoMdClose}
                                color='error'
                                className="w-max p-2"
                              />
                            </div>

                            {comando instanceof Andar && (
                              <div className='flex flex-row gap-2 items-center'>
                                <input
                                  value={comando.distancia}
                                  onChange={(event)=> setModelState(modelState.alterarDistancia(id, Number(event.target.value)))}
                                  type='number'
                                  className='w-full bg-slate-200 rounded-md p-1 w-35'
                                  min={0}
                                />
                                <p>cm</p>
                              </div>
                            )}

                            {comando instanceof Virar && (
                              <div className='flex flex-row gap-2 items-center'>
                                <select
                                  value={comando.direcao}
                                  onChange={(event) => setModelState(modelState.alterarDirecao(id, event.target.value as "Direita" | "Esquerda"))}
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

        {/* Comandos à direita */}
        <div className="fixed bottom-6 right-6 bg-gray-300 p-4 rounded-xl flex flex-col space-y-2">
            <span className="font-bold text-gray-900 mb-2 text-center">COMANDOS</span>
            <ComandoButton
              icon={FaLongArrowAltUp}
              iconPos='right'
              handleClick={adicionarAndar}
              disabled={modelState.conexaoEstado() !== "conectado" || modelState.jaTemLargar()}
            >
              Andar
            </ComandoButton>

            <ComandoButton
              icon={HiArrowUturnRight}
              iconPos='right'
              handleClick={adicionarVirar}
              disabled={modelState.conexaoEstado() !== "conectado" || modelState.jaTemLargar()}
            >
              Virar
            </ComandoButton>

            <ComandoButton
              icon={BsBoxSeamFill }
              iconPos='right'
              handleClick={adicionarLargar}
              disabled={modelState.conexaoEstado() !== "conectado" || modelState.jaTemLargar()}
            >
              Largar
            </ComandoButton>
        </div>
        
        </main>
    </div>
  )
}
