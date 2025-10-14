
export type comandos_aceitos = "Andar" | "Virar" | "Largar"
export type direcoes_aceitas = "Esquerda" | "Direita"

abstract class Comando {
  tipo: comandos_aceitos;
  id: string;

  constructor (id: string, tipo: comandos_aceitos){
    this.id = id;
    this.tipo = tipo;
  }
}

class Andar extends Comando {
  distancia: number;

  constructor (id: string, distancia: number){
    super(id, "Andar");

    this.distancia = distancia;
  }
}

class Virar extends Comando {
  direcao: direcoes_aceitas;

  constructor (id: string, direcao: direcoes_aceitas){
    super(id, "Virar");

    this.direcao = direcao;
  }
}

class Largar extends Comando {
  constructor (id: string){
    super(id, "Largar");

  }
}

export {Comando, Andar, Virar, Largar}