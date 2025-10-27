
export type comandos_aceitos = "Andar" | "Virar" | "Largar"

interface Comando {
  id: string;
  tipo: comandos_aceitos
}

interface Andar extends Comando {
  tipo: "Andar";
  distancia: number;
  
}

interface Virar extends Comando {
  tipo: "Virar";
  lado: "Direita" | "Esquerda"
}

interface Largar extends Comando {
  tipo: "Largar";
}

export type { Comando, Andar, Virar, Largar}