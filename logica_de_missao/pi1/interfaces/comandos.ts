
export type comandos_aceitos = "Andar" | "Virar" | "Largar"

interface Comando {
  tipo: comandos_aceitos
}

interface Andar extends Comando {
  distancia: number;
  
}

interface Virar extends Comando {
  lado: "Direita" | "Esquerda"
}

interface Largar extends Comando {

}

export type { Comando, Andar, Virar, Largar}