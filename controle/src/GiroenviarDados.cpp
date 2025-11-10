#include <Arduino.h>
#include "GiroenviarDados.h"

void enviarDadosGiroscopio(DadosGiroscopio dados) {
 Serial.print("Giroscópio X: ");
 Serial.print(dados.x);
 Serial.print(" deg/s\t");

 Serial.print("Giroscópio Y: ");
 Serial.print(dados.y);
 Serial.print(" deg/s\t");

 Serial.print("Giroscópio Z: ");
 Serial.print(dados.z);
 Serial.println(" deg/s");
}