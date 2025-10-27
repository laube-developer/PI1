"use client"
import { Dispatch, MouseEventHandler, SetStateAction } from "react"
import Button from "../Button"

import { FaLongArrowAltUp } from "react-icons/fa";
import { SideBarStateProps } from "@/app/dashboard/page";


type SidebarProps = {
    handleLogout: MouseEventHandler<HTMLButtonElement>,
    sidebarState: SideBarStateProps,
    setSideBarState: Dispatch<SetStateAction<SideBarStateProps>>,
    handleEnviar: MouseEventHandler<HTMLButtonElement>
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

        <Button handleClick={conectar} className={sidebarState.isConnected ? "!text-green-700 font-bold" : ""}>
            {!sidebarState.isConnected ? "Conectar" : "Conectado"}
        </Button>

        <Button  handleClick={handleEnviar}
            className="bg-gray-500 text-white">Enviar
        </Button>

        <Button>Histórico</Button>

        <div className="mt-auto">
            <button
            onClick={handleLogout}
            className="w-full md:w-16 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-xs flex items-center justify-center"
            >
            Logout
            </button>
        </div>
        </aside>
    )
}
    