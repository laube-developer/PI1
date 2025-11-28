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
import CodeView from '../../../components/CodeView'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { AppState } from '../../../entidades/appstate'
import { User } from '../../../entidades/user'
import { useMQTTClient } from '../../../hooks/useMQTTClient'
import { enviarMensagem } from '../../../actions/actions'
import GraficoDeslocamento from '../../../components/GraficoDeslocamento'
import { getMQTTClient } from '../../../lib/mqtt'
import { MqttClient } from 'mqtt'

interface Ponto {
  x: number;
  y: number;
}

type SideBarStateProps = {
  isConnected: boolean;
}

export default function DashboardPage() {
  const [modelState, setModelState] = useState<AppState>(new AppState())
  const [posicoesReais, setPosicoesReais] = useState<Ponto[]>([{ x: 0, y: 0 }]);
  const [client, setClient] = useState<MqttClient | null>(null);
  const [sidebarState, setSideBarState] = useState<SideBarStateProps>({ isConnected: false });

  const router = useRouter()

  const {isConnected, publish, disconnect, reconnect} = useMQTTClient();

  useEffect(() => {
    const mqttClient = getMQTTClient();
    setClient(mqttClient);

    const messageHandler = (topic: string, payload: Buffer) => {
      if (topic === "carrodoovo/telemetria") {
        try {
          const message = JSON.parse(payload.toString());
          if (message.x !== undefined && message.y !== undefined) {
            setPosicoesReais(prevPosicoes => [...prevPosicoes, { x: message.x, y: message.y }]);
          }
        } catch (error) {
          console.error("Erro ao processar mensagem MQTT:", error);
        }
      }
    };

    mqttClient.on('message', messageHandler);

    return () => {
      mqttClient.off('message', messageHandler);
    };
  }, []);

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

  useEffect(() => {
    setSideBarState({ isConnected: modelState.conexaoEstado() === 'conectado' });
  }, [modelState.conexaoEstado()]);

  useEffect(() => {
    if (sidebarState.isConnected && modelState.conexaoEstado() !== 'conectado') {
      setModelState(modelState.setConexaoEstado('conectado'));
    } else if (!sidebarState.isConnected && modelState.conexaoEstado() === 'conectado') {
      setModelState(modelState.setConexaoEstado('desconectado'));
    }
  }, [sidebarState.isConnected]);

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
    if (!isConnected) {
        alert("Conecte-se ao carrinho para enviar os comandos");
        return;
    }
    
    if (modelState.comandos().length == 0) {
      alert("Nenhum comando foi inserido!");
      return;
    }

    let comandosString = ""

    const comandos = modelState.comandos().map((c, i, array) => {
      if (c instanceof Andar) {
        const and = c as Andar;
        comandosString += `F:${c.distancia},`;
      } else if (c instanceof Virar){
        const vir = c as Virar;
        comandosString += c.direcao == "Esquerda" ? "L," : "R,";
        
      } else {
        comandosString += "D,"
      }
    });

    console.log(comandosString)

    publish("carrodoovo/comandos", comandosString)
    .then(() => {
      alert("Comandos enviados.")
    })
    .catch(()=> alert("Falha ao enviar os comandos."))
  }

  const paradaEmergencial = () => {
    publish("carrodoovo/paradaDeEmergencia", "parada");
  }

  const calcularDeslocamentoComandado = (): Ponto[] => {
    const pontos: Ponto[] = [{ x: 0, y: 0 }];
    let x = 0;
    let y = 0;
    let angulo = 0; // Em graus

    modelState.comandos().forEach(comando => {
      if (comando instanceof Andar) {
        const radianos = (angulo * Math.PI) / 180;
        x += comando.distancia * Math.cos(radianos);
        y += comando.distancia * Math.sin(radianos);
        pontos.push({ x, y });
      } else if (comando instanceof Virar) {
        if (comando.direcao === 'Direita') {
          angulo -= 90;
        } else {
          angulo += 90;
        }
      }
    });

    return pontos;
  };

  if (!modelState.user()) return <p>Verificando sessão...</p>

  return (
    <div className="min-h-screen flex bg-gray-100">
<<<<<<< HEAD
      <Sidebar
        handleDisconnect={disconnect}
        isConnected={isConnected}
        handleReconnect={reconnect}
        handleLogout={handleLogout}
        modelState={modelState}
        setModelState={setModelState}
        handleEnviar={handleEnviar}
        handleParadaEmergencia={paradaEmergencial}
        
        />
=======
      <Sidebar handleLogout={handleLogout} sidebarState={sidebarState} setSideBarState={setSideBarState} handleEnviar={handleEnviar}/>
>>>>>>> 1e04d39 (feat: adiciona grafico para exibição das posições do carrinho, tanto a posição ideal (via comandos) quanto a real, recebida via mqtt)

      {/* Main content */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center bg-slate-200 relative">

        {modelState.comandos().length === 0 && (
          <div className='flex flex-col items-center'>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Bem-vindo, {modelState.user()?.email}
            </h1>
            <p className="text-gray-700 mb-6 text-center">Sem comandos adicionados. Adicione-os no menu de comandos!.</p>
          </div>
        )}

        {modelState.comandos().length > 0 && (
          <>
            <div className='w-50 mt-8 absolute bottom-2 left-2'>
              <CodeView code={JSON.stringify(modelState.comandos(), null, 2)}></CodeView>
            </div>

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
            <div className="w-full max-w-4xl mt-8">
              <GraficoDeslocamento
                deslocamentoComandado={calcularDeslocamentoComandado()}
                deslocamentoReal={posicoesReais}
              />
            </div>
          </>
        )}

        {/* Comandos à direita */}
        <div className="fixed bottom-6 right-6 bg-gray-300 p-4 rounded-xl flex flex-col space-y-2">
            <span className="font-bold text-gray-900 mb-2 text-center">COMANDOS</span>
            <ComandoButton
              icon={FaLongArrowAltUp}
              iconPos='right'
              handleClick={adicionarAndar}
              disabled={!isConnected || modelState.jaTemLargar()}
            >
              Andar
            </ComandoButton>

            <ComandoButton
              icon={HiArrowUturnRight}
              iconPos='right'
              handleClick={adicionarVirar}
              disabled={!isConnected || modelState.jaTemLargar()}
            >
              Virar
            </ComandoButton>

            <ComandoButton
              icon={BsBoxSeamFill }
              iconPos='right'
              handleClick={adicionarLargar}
              disabled={!isConnected || modelState.jaTemLargar()}
            >
              Largar
            </ComandoButton>
        </div>
        
        </main>
    </div>
  )
}
