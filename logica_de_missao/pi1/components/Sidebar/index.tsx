"use client"
import { Dispatch, MouseEventHandler, SetStateAction } from "react"
import Button from "../Button"
import { PiSignOut } from "react-icons/pi";
import { IoIosRefresh } from "react-icons/io"; 
import { AppState } from "../../entidades/appstate";
import { IoIosWarning } from "react-icons/io";

import { FaLongArrowAltUp } from "react-icons/fa";


type SideBarStateProps = {
    isConnected: boolean;
}

type SidebarProps = {
    handleLogout: MouseEventHandler<HTMLButtonElement>;
    modelState: AppState;
    setModelState: Dispatch<SetStateAction<AppState>>;
    handleEnviar: MouseEventHandler<HTMLButtonElement>;
    
    isConnected: boolean; 
    handleReconnect: () => void; 
    handleDisconnect: () => void;
    handleParadaEmergencia: () => void;
}

export default function Sidebar({handleLogout, sidebarState, setSideBarState, handleEnviar}: SidebarProps){
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

        <Button color="warn"
        icon={IoIosWarning}
        iconPos="left"
        iconSize={30}
        handleClick={handleParadaEmergencia}
        > Parada de Emergência</Button>

        <Button>Histórico</Button>

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