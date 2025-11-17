// encoders.cpp

#include "encoder.h" // Inclui o cabeçalho que define a interface
#define DIAMETRO_RODA_MM 68.0 
#define PULSOS_POR_VOLTA 63.0

const float DISTANCIA_POR_PULSO_CM = 
    (PI * DIAMETRO_RODA_MM) / (PULSOS_POR_VOLTA * 10.0);

// --- Variáveis Globais Privadas (Visíveis apenas neste arquivo) ---
// Variáveis voláteis são necessárias para que as funções de interrupção (ISRs) possam modificá-las
volatile long pulsosEsq = 0;
volatile long pulsosDir = 0;

// Definição dos pinos GPIO do ESP32 usados para os sensores D0
const int pinoD0Esq = 18; 
const int pinoD0Dir = 19;

unsigned long prevMillisE = 0;
unsigned long prevMillisD = 0;
const long limiteTempo = 200;


// --- Funções de Tratamento de Interrupção (ISR) ---
// Funções curtas e eficientes que incrementam o contador quando um pulso é detectado.
// IRAM_ATTR é usado para otimizar o desempenho no ESP32.
void IRAM_ATTR isrEsq() {
  unsigned long current_time = millis();

//   if (current_time - prevMillisE < limiteTempo) {
//     return;
//   }

  pulsosEsq++;
  prevMillisE = current_time; 
}

void IRAM_ATTR isrDir() {
  unsigned long current_time = millis();

//   if (current_time - prevMillisD < limiteTempo) {
//     return;
//   }

  pulsosDir++;

  prevMillisD = current_time;
}

// --- Implementação da função de Inicialização (Definida no .h) ---
void inicializarEncoders() {
    // Configura os pinos como entrada com pull-up interno
    pinMode(pinoD0Esq, INPUT_PULLUP);
    pinMode(pinoD0Dir, INPUT_PULLUP);

    // Anexa as interrupções aos pinos especificados.
    // Usamos RISING (subida da borda de 0V para 3.3V) assumindo o comportamento padrão do sensor.
    attachInterrupt(digitalPinToInterrupt(pinoD0Esq), isrEsq, RISING);
    attachInterrupt(digitalPinToInterrupt(pinoD0Dir), isrDir, RISING);
}

// --- Implementação da função de Leitura (Definida no .h) ---
DadosEncoder lerDadosEncoders() {
    DadosEncoder dados;
    
    // Desabilita temporariamente as interrupções para garantir a leitura atômica (Thread Safety)
    noInterrupts(); 
    dados.pulsosEsquerdo = pulsosEsq;
    dados.pulsosDireito = pulsosDir;
    dados.distanciaTotalEsquerdo = pulsosEsq*DISTANCIA_POR_PULSO_CM;
    dados.distanciaTotalDireito = pulsosDir*DISTANCIA_POR_PULSO_CM;
    interrupts(); // Reabilita as interrupções

    return dados;
}

// --- Implementação da função de Envio (Definida no .h) ---
void enviarDadosEncoders(DadosEncoder dados) {
    // Exibe os dados na porta Serial
    Serial.print("PEsq: ");
    Serial.print(dados.pulsosEsquerdo);
    Serial.print(" | PDir: ");
    Serial.print(dados.pulsosDireito);
    Serial.print(" | Esq: ");
    Serial.print(dados.distanciaTotalEsquerdo);
    Serial.print(" cm");
    Serial.print(" | Dir: ");
    Serial.print(dados.distanciaTotalDireito);
    Serial.println(" cm");
    
    // Nota: Em um projeto real, você poderia substituir isso por uma
    // comunicação Wi-Fi (MQTT, HTTP) ou Bluetooth.
}
