import { User } from "./user"
import { Andar, Comando, Depositar, Virar } from "./comandos"
import { ComandoSalvo } from "./comandosSalvos"

type ConnectionState = "conectando" | "conectado" | "desconectando" | "desconectado"

type AppStateUpdate = {
    conexaoEstado?: ConnectionState,
    mensagensRecebidas?: string[],
    user?: User | null,
    comandos?: Comando[]
    jaTemLargar?: boolean
}

export class AppState {
    private conexaoEstadoState: ConnectionState = "desconectado"
    private mensagensRecebidasState: string[] = []
    private userState: User | null = null
    private comandosState: Comando[] = []
    private jaTemLargarState: boolean = false;

    constructor(
        conexaoEstado?: ConnectionState,
        mensagensRecebidas?: string[],
        user?: User | null,
        comandos?: Comando[],
        jaTemLargar?: boolean
    ) {
        if (conexaoEstado !== undefined) this.conexaoEstadoState = conexaoEstado
        if (mensagensRecebidas !== undefined) this.mensagensRecebidasState = mensagensRecebidas
        if (user !== undefined) this.userState = user
        if (comandos !== undefined) this.comandosState = comandos
        if (jaTemLargar !== undefined) this.jaTemLargarState = jaTemLargar
    }

    private getEstadoAtualizado(update: AppStateUpdate): AppState {
        return new AppState(
            update.conexaoEstado !== undefined ? update.conexaoEstado : this.conexaoEstadoState,
            update.mensagensRecebidas !== undefined ? update.mensagensRecebidas : this.mensagensRecebidasState,
            update.user !== undefined ? update.user : this.userState,
            update.comandos !== undefined ? [...update.comandos] : this.comandosState,
            update.jaTemLargar !== undefined ? update.jaTemLargar : this.jaTemLargarState
        )
    }       

    conexaoEstado(): ConnectionState{return this.conexaoEstadoState}
    setConexaoEstado(state: ConnectionState) {
        return this.getEstadoAtualizado({conexaoEstado: state})
    }

    mensagensRecebidas(): string[] {return this.mensagensRecebidasState}
    addMsgLista(msg: string) {
        return this.getEstadoAtualizado({mensagensRecebidas: [...this.mensagensRecebidasState, msg]})
    }

    user(){return this.userState}
    setUser(user: User){
        return this.getEstadoAtualizado({user: user})
    }

    comandos(){return this.comandosState}

    adicionarAndar(){
        const novoComando = new Andar(crypto.randomUUID(), 0);
        return this.getEstadoAtualizado({comandos: [...this.comandosState, novoComando]})
    }

    adicionarVirar(){
        const novoComando = new Virar(crypto.randomUUID(), "Esquerda");
        return this.getEstadoAtualizado({comandos: [...this.comandosState, novoComando]})
    }

    adicionarLargar(){
        const novoComando = new Depositar(crypto.randomUUID());
        return this.getEstadoAtualizado({
            comandos: [...this.comandosState, novoComando],
            jaTemLargar: true
        })
    }

    alterarDistancia(id: number, distancia: number){
        if (this.comandosState[id].tipo != "Andar") return this
        console.log("Alterando distância do comando", id, "para", distancia);
        const novoComando = new Andar(this.comandosState[id].id, Math.abs(distancia))
        const novaLista = [...this.comandosState];
        novaLista[id] = novoComando;
        return this.getEstadoAtualizado({comandos: novaLista})
    }

    alterarDirecao(id: number, direcao: "Esquerda" | "Direita"){
        if (this.comandosState[id].tipo != "Virar") return this
        console.log("Alterando direção do comando", id, "para", direcao);
        const novoComando = new Virar(this.comandosState[id].id, direcao)
        const novaLista = [...this.comandosState];
        novaLista[id] = novoComando;
        return this.getEstadoAtualizado({comandos: novaLista})
    }
    
    removerComando(id: number){
        if (id > this.comandosState.length -1) return this;
        console.log("Removendo comando", id);
        const novaLista = [...this.comandosState];
        novaLista.splice(id, 1);
        return this.getEstadoAtualizado({comandos: novaLista, jaTemLargar: this.comandosState[id].tipo === "Largar" ? false : this.jaTemLargarState})
    }

    atualizarListaComandos(comandos: Comando[]){
        return this.getEstadoAtualizado({comandos: comandos})
    }

    jaTemLargar(): boolean {
        return this.jaTemLargarState;
    }

    static reidratarComando = (objeto: ComandoSalvo): Comando | null => {
        if (!objeto) {
            return null;
        }
        switch (objeto.tipo) {
          case "Andar":
            // Garante que 'distancia' é um número
            return new Andar(crypto.randomUUID(), objeto.distancia ?? 0);
          case "Virar":
            // Garante que 'direcao' é um valor aceito, ou usa um padrão
            const direcao = (objeto.direcao === 'Direita' || objeto.direcao === 'Esquerda') ? objeto.direcao : 'Esquerda';
            return new Virar(crypto.randomUUID(), direcao);
          case "Largar":
            return new Depositar(crypto.randomUUID());
            
          default:
            console.error("Tipo de comando desconhecido", objeto.tipo);
            return null;
        }
      }
}