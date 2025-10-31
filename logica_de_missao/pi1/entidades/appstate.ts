import mqtt from "mqtt"
import { User } from "./user"
import { Andar, Comando, Largar, Virar } from "./comandos"
import { ComandoSalvo } from "./comandosSalvos"

export class AppState {
    private isConnectedState: boolean = false
    private mensagensRecebidasState: string[] = []
    private clientState?: mqtt.MqttClient | null = null
    private userState: User | null = null
    private comandosState: Comando[] = []

    isConnected(): boolean{return this.isConnectedState}
    setConnected(state: boolean) {
        this.isConnectedState = state
        return this
    }

    mensagensRecebidas(): string[] {return this.mensagensRecebidasState}
    addMsgLista(msg: string) {
        this.mensagensRecebidasState.push(msg)
        return this
    }

    client(){return this.clientState}
    setClient(mqtt_client: mqtt.MqttClient){
        this.clientState = mqtt_client
        return this
    }

    user(){return this.userState}
    setUser(user: User){
        this.userState = user
        return this
    }

    comandos(){return this.comandosState}

    adicionarAndar(){
        this.comandosState.push(new Andar(crypto.randomUUID(), 0))
        return this
    }

    adicionarVirar(){
        this.comandosState.push(new Virar(crypto.randomUUID(), "Esquerda"))
        return this
    }

    adicionarLargar(){
        this.comandosState.push(new Largar(crypto.randomUUID()))
        return this
    }

    alterarDistancia(id: number, distancia: number){
        if (this.comandosState[id].tipo != "Andar") return
        this.comandosState[id] = new Andar(this.comandosState[id].id, Math.abs(distancia));
        return this
    }

    alterarDirecao(id: number, direcao: "Esquerda" | "Direita"){
        if (this.comandosState[id].tipo != "Virar") return
        this.comandosState[id] = new Virar(this.comandosState[id].id, direcao);
        return this
    }
    
    removerComando(id: number){
        if (id > this.comandosState.length -1) return;
        this.comandosState.splice(id, 1);
        return this
    }

    atualizarListaComandos(comandos: Comando[]){
        this.comandosState = comandos
        return this
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