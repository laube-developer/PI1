
export type comandos_aceitos = "Andar" | "Virar" | "Largar"
export type direcoes_aceitas = "Esquerda" | "Direita"

abstract class Comando {
  tipo: comandos_aceitos;
  id: string;

  constructor (id: string, tipo: comandos_aceitos){
    this.id = id;
    this.tipo = tipo;
  }


  toJSON() {
    return {
      tipo: this.tipo,
      id: this.id
    };
  }
}

class Andar extends Comando {
  distancia: number;

  constructor (id: string, distancia: number){
    super(id, "Andar");

    this.distancia = distancia;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      distancia: this.distancia
    };
  }
}

class Virar extends Comando {
  direcao: direcoes_aceitas;

  constructor (id: string, direcao: direcoes_aceitas){
    super(id, "Virar");

    this.direcao = direcao;
  }


  toJSON() {
    return {
      ...super.toJSON(),
      direcao: this.direcao
    };
  }
}
class Largar extends Comando {

  constructor (id: string){
    super(id, "Largar");
  }

  toJSON() {
    return super.toJSON();
  }
}

export {Comando, Andar, Virar, Largar}
