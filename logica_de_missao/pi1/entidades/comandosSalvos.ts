import { comandos_aceitos } from "./comandos";

export interface ComandoSalvo {
    tipo: comandos_aceitos;
    distancia?: number; 
    direcao?: 'Direita' | 'Esquerda';
  }