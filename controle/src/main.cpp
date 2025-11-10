#include <Arduino.h>
#include "config.h"
#include "motors.h"
#include "command_queue.h"
#include "executor.h"
#include "demo_feed.h"
#include "tipos_de_dados.h"
#include "giroscopio.h"
#include "GiroenviarDados.h"

DadosGiroscopio meusDadosSensor;

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println();
  Serial.println("=== Carro do Ovo — Simulacao: Velocidades por Roda (fila interna) ===");
  motors::setup();
  cmdq::clear();
  executor::setup();
  demo::setup();
  setupGiroscopio();
}

void loop() {
  demo::tick();

  executor::tick();

  meusDadosSensor = lerGiroscopio();

  enviarDadosGiroscopio(meusDadosSensor);
  
  delay(2);
}
