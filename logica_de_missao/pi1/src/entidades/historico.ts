import { Ponto } from "./ponto";
import { Comando } from "./comandos";

export interface Historico {
    id: string;
    comandos: Comando[];
    deslocamento_comandado: Ponto[];
    deslocamento_real: Ponto[];
    created_at: string;
}