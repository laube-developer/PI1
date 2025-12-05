#include "giroscopio-scale_factor.h"
#include "giroscopio.h"
#include <Arduino.h>

void k_rate_calibrado (float angulo_referencia) {
    int amostras = 20;
    float soma_angulos = 0.0f;
    Serial.println("Teste do Fator de Escala do Giroscópio");
    for (int i = 0; i < amostras; i++) {
        Serial.print("Amostra "); Serial.print(i + 1); Serial.println(" de " + String(amostras));
        soma_angulos += abs(testarFatorDeEscala(angulo_referencia));
    }

    float angulo_medio = soma_angulos / amostras;
    Serial.print("Ângulo Médio Lido: "); Serial.print(angulo_medio); Serial.println(" graus");
    float k_rate = angulo_referencia / angulo_medio;
    Serial.print("Fator de Escala Calculado (K_RATE): "); Serial.println(k_rate);
}

float testarFatorDeEscala(float angulo_referencia) {
    Serial.println("Teste do Fator de Escala do Giroscópio...");

    float angulo_lido = 0.0f;
    unsigned long previousTime = millis();

    Serial.println("Gire o giroscópio em " + String(angulo_referencia) + " graus e pressione qualquer tecla...");
    while (Serial.available() == 0) {
        unsigned long currentTime = millis();
        float deltaTime = (currentTime - previousTime) / 1000.0f; // em segundos
        previousTime = currentTime;

        float vel_angular = lerGiroscopio();
        angulo_lido += vel_angular * deltaTime;
    }
    Serial.read();

    Serial.print("Ângulo Lido: "); Serial.print(angulo_lido); Serial.println(" graus");
    return angulo_lido;
}