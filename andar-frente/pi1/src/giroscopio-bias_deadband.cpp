#include "giroscopio-bias_deadband.h"
#include "giroscopio.h"
#include "config.h"
#include <Arduino.h>

// Fator de segurança: 3x o Desvio Padrão para cobrir 99.7% do ruído
const float SIGMA_FACTOR = 3.0f; 

GyroCalib calibrarGiro() {
    const int N = 1000;
    float soma = 0.0f;
    float leituras[N];

    Serial.println("Calibrando MPU-6050: Coletando " + String(N) + " amostras...");

    // Coleta das leituras
    for (int i = 0; i < N; i++) {
        leituras[i] = lerGiroscopio();
        soma += leituras[i];
        delay(5); // Pequena espera para evitar amostras correlacionadas
    }

    // --- 1. Média = Bias (Offset) ---
    float media = soma / (float)N;

    // --- 2. Desvio Padrão = Dead Band Base ---
    float soma2 = 0.0f;
    for (int i = 0; i < N; i++) {
        float d = leituras[i] - media;
        soma2 += d * d;
    }
    // O desvio padrão é a raiz quadrada da variância (soma2 / N)
    float desvio_padrao = sqrt(soma2 / N);
    
    // --- 3. Dead Band Final (Fator de segurança) ---
    float deadband_final = desvio_padrao * SIGMA_FACTOR;

    Serial.print("Bias Z (Média): ");
    Serial.print(media, 4);
    Serial.println(" deg/s");

    Serial.print("Deadband Z ("); Serial.print(SIGMA_FACTOR); Serial.print("x Sigma): ");
    Serial.print(deadband_final, 4);
    Serial.println(" deg/s");

    return {media, deadband_final};
}