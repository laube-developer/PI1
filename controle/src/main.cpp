#include <Arduino.h>
#include "config.h"
#include "motors.h"
#include "encoder.h"
#include "giroscopio.h"

void setup() {
  Serial.begin(115200);
  delay(500);
  
  motors::initialize();
  inicializarEncoders();
  setupGiroscopio();
}

float totalDeAmostrasX = 0;
float somaTotalAmostrasX = 0;

float totalDeAmostrasY = 0;
float somaTotalAmostrasY = 0;

float totalDeAmostrasZ = 0;
float somaTotalAmostrasZ = 0;

void loop() {
  //DadosEncoder dados = lerDadosEncoders();
  //enviarDadosEncoders(dados);

  // motors::andarDoisMotoresFrente();
  // delay(3000);

  // motors::pararDoisMotores();
  // delay(2000);

  DadosGiroscopio dadosG = lerGiroscopio();
  totalDeAmostrasX++;
  somaTotalAmostrasX += dadosG.x;
  totalDeAmostrasY++;
  somaTotalAmostrasY += dadosG.y;
  totalDeAmostrasZ++;
  somaTotalAmostrasZ += dadosG.z;
  Serial.println("Media x: " + String(somaTotalAmostrasX/totalDeAmostrasX) + 
                 " | Media y: " + String(somaTotalAmostrasY/totalDeAmostrasY) + 
                 " | Media z: " + String(somaTotalAmostrasZ/totalDeAmostrasZ));

  delay(100);
}