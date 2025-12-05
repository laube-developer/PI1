"use client"
import { Dispatch, MouseEventHandler, SetStateAction } from "react"
import Button from "../Button"
import { IoIosWarning } from "react-icons/io";

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
    comandos: () => Comando[]
    handleParadaEmergencia: () => void
}

export default function Sidebar({ handleLogout, sidebarState, setSideBarState, handleEnviar, comandos, handleParadaEmergencia }: SidebarProps) {
    const conectar = () => {
        setSideBarState({ ...sidebarState, isConnected: !sidebarState.isConnected })
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
                {sidebarState.isConnected ? (
                    <span className="text-green-600 font-bold">Conectado</span>
                ) : (
                    <span className="text-red-600 font-bold">Desconectado</span>
                )}
            </div>

            <Button handleClick={conectar} className={sidebarState.isConnected ? "text-green-700! font-bold" : ""}>
                {!sidebarState.isConnected ? "Conectar" : "Conectado"}
            </Button>

            <Button
                handleClick={handleEnviar}
                className="bg-gray-500 text-white"
                disabled={!sidebarState.isConnected}
            >
                Enviar
            </Button>


            <Button color="warn"
                icon={IoIosWarning}
                iconPos="left"
                iconSize={30}
                handleClick={handleParadaEmergencia}
            > Parada de Emergência</Button>

            <Button handleClick={handleEnviar}
                className="bg-gray-500 text-white"
                disabled={comandos.length === 0}
            >Enviar

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