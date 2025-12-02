#pragma once

#define VELOCIDADE_BASE 150  // Velocidade base dos motores (0-255)

// ===== Giroscópio =====
//#define K_RATE 1.0292       // Definir após k_rate_calibrado();
#define K_RATE 0.995355f
#define ALPHA_OMEGA 0.15f    // Filtro passa-baixa para omega
#define ALPHA_THETA 0.98f    // Filtro passa-baixa para theta

// ===== Wi-Fi =====
#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASS ""

// ===== MQTT =====
// Pode usar um broker público p/ testes:
#define MQTT_HOST "test.mosquitto.org"
#define MQTT_PORT 1883
#define MQTT_SUB_TOPIC "robot/cmd"      // comandos para o robô
#define MQTT_CLIENT_PREFIX "carro-do-ovo-"

// Pinos de Direção
#define IN1 25
#define IN2 26
#define IN3 14
#define IN4 27

// Pinos de Velocidade (PWM)
#define ENA 32
#define ENB 33

#define EGG_MOTOR_PIN  12

// Pinos do Giroscópio (MPU-6050)
#define SDA_PIN 21
#define SCL_PIN 22

// ===== PWM =====
#define PWM_FREQ_HZ   20000
#define PWM_RES_BITS  8
#define PWM_CH_M1     0
#define PWM_CH_M2     1