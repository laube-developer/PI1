
export type comandos_aceitos = "Andar" | "Virar" | "Largar"
export type direcoes_aceitas = "Esquerda" | "Direita"

abstract class Comando {
  tipo: comandos_aceitos;
  id: string;

  constructor (id: string, tipo: comandos_aceitos){
    this.id = id;
    this.tipo = tipo;
  }

<<<<<<< HEAD:logica_de_missao/pi1/entidades/comandos.ts
  abstract toString(): string;
=======
  toJSON() {
    return {
      tipo: this.tipo,
      id: this.id
    };
  }
>>>>>>> 643772f (adiciona os testes restantes, gráfico de deslocamento e histórico de corridas):logica_de_missao/pi1/src/entidades/comandos.ts
}

class Andar extends Comando {
  distancia: number;

  constructor (id: string, distancia: number){
    super(id, "Andar");

    this.distancia = distancia;
  }

<<<<<<< HEAD:logica_de_missao/pi1/entidades/comandos.ts
  toString() {
    return `${this.tipo}:${this.distancia}`;
=======
  toJSON() {
    return {
      ...super.toJSON(),
      distancia: this.distancia
    };
>>>>>>> 643772f (adiciona os testes restantes, gráfico de deslocamento e histórico de corridas):logica_de_missao/pi1/src/entidades/comandos.ts
  }
}

class Virar extends Comando {
  direcao: direcoes_aceitas;

  constructor (id: string, direcao: direcoes_aceitas){
    super(id, "Virar");

    this.direcao = direcao;
  }

<<<<<<< HEAD:logica_de_missao/pi1/entidades/comandos.ts
  toString() {
    return `${this.tipo}:${this.direcao}`;
=======
  toJSON() {
    return {
      ...super.toJSON(),
      direcao: this.direcao
    };
>>>>>>> 643772f (adiciona os testes restantes, gráfico de deslocamento e histórico de corridas):logica_de_missao/pi1/src/entidades/comandos.ts
  }
}

class Depositar extends Comando {
  constructor (id: string){
    super(id, "Largar");
  }

  toJSON() {
    return super.toJSON();
  }

  toString() {
    return this.tipo;
  }
}

export {Comando, Andar, Virar, Depositar}