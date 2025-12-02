"use client"
import { Dispatch, MouseEventHandler, SetStateAction } from "react"
import Button from "../Button"
import { IoIosRefresh } from "react-icons/io"; 
import { AppState } from "../../entidades/appstate";
import { IoIosWarning } from "react-icons/io";

import { FaLongArrowAltUp } from "react-icons/fa";
import Link from "next/link"

import { PiSignOut } from "react-icons/pi";
import { Comando } from "@/entidades/comandos";


type SideBarStateProps = {
    isConnected: boolean;
}

type SidebarProps = {
    handleLogout: MouseEventHandler<HTMLButtonElement>,
    sidebarState: SideBarStateProps,
    setSideBarState: Dispatch<SetStateAction<SideBarStateProps>>,
    handleEnviar: MouseEventHandler<HTMLButtonElement>,
    handleSalvar: MouseEventHandler<HTMLButtonElement>,
    comandos: Comando[]
}

export default function Sidebar({handleLogout, sidebarState, setSideBarState, handleEnviar, handleSalvar, comandos}: SidebarProps){
    const conectar = ()=>{
        setSideBarState({...sidebarState, isConnected: !sidebarState.isConnected})
    }

    return (
        <aside className="w-30 md:w-35 bg-gray-300 flex flex-col items-center py-6 px-3 space-y-4 border-r border-gray-400">
        <div className="flex flex-col items-center space-y-2 w-full">
            <img
            src="/carrodoovo.png"
            alt="Logo Carro do Ovo"
            className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-xs font-bold text-gray-900 text-center">CARRO DO OVO</span>
        </div>

        <div className="w-full text-xs flex flex-col items-start">
            <b>Status: </b>
            {isConnected ? (
                <span className="text-green-600 font-bold">Conectado</span>
            ) : (
                <span className="text-red-600 font-bold">Desconectado</span>
            )}
        </div>

        {isConnected ? (
            <Button
                handleClick={handleDisconnect} 
                color="error"
            >
                Desconectar
            </Button>
        ) : (
            <Button
                handleClick={handleReconnect} 
                color="success"
                icon={IoIosRefresh}
            >
                Tentar Reconectar
            </Button>
        )}

        <Button  
            handleClick={handleEnviar}
            className="bg-gray-500 text-white"
            disabled={!isConnected} 
        >
            Enviar
        </Button>

<<<<<<< HEAD
        <Button color="warn"
        icon={IoIosWarning}
        iconPos="left"
        iconSize={30}
        handleClick={handleParadaEmergencia}
        > Parada de Emergência</Button>
=======
        <Button  handleClick={handleEnviar}
            className="bg-gray-500 text-white"
            disabled={comandos.length === 0}
            >Enviar
        </Button>
>>>>>>> 643772f (adiciona os testes restantes, gráfico de deslocamento e histórico de corridas)

        <Button
            handleClick={handleSalvar}
            className="bg-blue-500 text-white"
            disabled={comandos.length === 0}
        >
            Salvar
        </Button>

        <Link href="/dashboard/historico" className="w-full">
            <Button className="w-full">Histórico</Button>
        </Link>

        <div className="mt-auto w-full">
            <Button
                handleClick={handleLogout}
                color="error"
                icon={PiSignOut}
            >Logout</Button>
        </div>
        </aside>
    )
}