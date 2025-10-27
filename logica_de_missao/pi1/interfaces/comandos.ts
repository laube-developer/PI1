
export type comandos_aceitos = "Andar" | "Virar" | "Largar"
export type direcoes_aceitas = "Esquerda" | "Direita"

abstract class Comando {
  tipo: comandos_aceitos;

  constructor (tipo: comandos_aceitos){
    this.tipo = tipo;
  }
}

class Andar extends Comando {
  distancia: number;

  constructor (distancia: number){
    super("Andar");

    this.distancia = distancia;
  }
}

class Virar extends Comando {
  direcao: direcoes_aceitas;

  constructor (direcao: direcoes_aceitas){
    super("Virar");

    this.direcao = direcao;
  }
}

class Largar extends Comando {
  constructor (){
    super("Largar");

  }
}

export {Comando, Andar, Virar, Largar}