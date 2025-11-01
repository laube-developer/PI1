import mqtt from "mqtt"
import { User } from "./user"
import { Andar, Comando, Largar, Virar } from "./comandos"
import { ComandoSalvo } from "./comandosSalvos"

type AppStateUpdate = {
    isConnected?: boolean,
    mensagensRecebidas?: string[],
    client?: mqtt.MqttClient | null,
    user?: User | null,
    comandos?: Comando[]
}

export class AppState {
    private isConnectedState: boolean = false
    private mensagensRecebidasState: string[] = []
    private clientState?: mqtt.MqttClient | null = null
    private userState: User | null = null
    private comandosState: Comando[] = []

    constructor(
        isConnected?: boolean,
        mensagensRecebidas?: string[],
        client?: mqtt.MqttClient | null,
        user?: User | null,
        comandos?: Comando[]
    ) {
        if (isConnected !== undefined) this.isConnectedState = isConnected
        if (mensagensRecebidas !== undefined) this.mensagensRecebidasState = mensagensRecebidas
        if (client !== undefined) this.clientState = client
        if (user !== undefined) this.userState = user
        if (comandos !== undefined) this.comandosState = comandos
    }

    private getEstadoAtualizado(update: AppStateUpdate): AppState {
        return new AppState(
            update.isConnected !== undefined ? update.isConnected : this.isConnectedState,
            update.mensagensRecebidas !== undefined ? update.mensagensRecebidas : this.mensagensRecebidasState,
            update.client !== undefined ? update.client : this.clientState,
            update.user !== undefined ? update.user : this.userState,
            update.comandos !== undefined ? update.comandos : this.comandosState
        )
    }       

    isConnected(): boolean{return this.isConnectedState}
    setConnected(state: boolean) {
        return this.getEstadoAtualizado({isConnected: state})
    }

    mensagensRecebidas(): string[] {return this.mensagensRecebidasState}
    addMsgLista(msg: string) {
        return this.getEstadoAtualizado({mensagensRecebidas: [...this.mensagensRecebidasState, msg]})
    }

    client(){return this.clientState}
    setClient(mqtt_client: mqtt.MqttClient){
        return this.getEstadoAtualizado({client: mqtt_client})
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
        const novoComando = new Largar(crypto.randomUUID());
        return this.getEstadoAtualizado({comandos: [...this.comandosState, novoComando]})
    }

    alterarDistancia(id: number, distancia: number){
        if (this.comandosState[id].tipo != "Andar") return
        const novoComando = new Andar(this.comandosState[id].id, Math.abs(distancia))
        let novaLista = [...this.comandosState];
        novaLista[id] = novoComando;
        return this.getEstadoAtualizado({comandos: novaLista})
    }

    alterarDirecao(id: number, direcao: "Esquerda" | "Direita"){
        if (this.comandosState[id].tipo != "Virar") return
        const novoComando = new Virar(this.comandosState[id].id, direcao)
        let novaLista = [...this.comandosState];
        novaLista[id] = novoComando;
        return this.getEstadoAtualizado({comandos: novaLista})
    }
    
    removerComando(id: number){
        if (id > this.comandosState.length -1) return;
        let novaLista = [...this.comandosState];
        novaLista.splice(id, 1);
        return this.getEstadoAtualizado({comandos: novaLista})
    }

    atualizarListaComandos(comandos: Comando[]){
        return this.getEstadoAtualizado({comandos: comandos})
    }

    static reidratarComando = (objeto: ComandoSalvo): Comando | null => {
        switch (objeto.tipo) {
          case "Andar":
            // Garante que 'distancia' é um número
            return new Andar(crypto.randomUUID(), objeto.distancia ?? 0);
          case "Virar":
            // Garante que 'direcao' é um valor aceito, ou usa um padrão
            const direcao = (objeto.direcao === 'Direita' || objeto.direcao === 'Esquerda') ? objeto.direcao : 'Esquerda';
            return new Virar(crypto.randomUUID(), direcao);
          case "Largar":
            return new Largar(crypto.randomUUID());
            
          default:
            console.error("Tipo de comando desconhecido", objeto.tipo);
            return null;
        }
      }
}