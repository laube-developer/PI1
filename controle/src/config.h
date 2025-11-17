#pragma once

// ===== Toggle de simulação =====
// 1 = sem hardware: só imprime no Serial (recomendado agora)
// 0 = com hardware: usa pinos e PWM
#define SIMULATE 0

// ===== Wi-Fi =====
// Para Wokwi: SSID "Wokwi-GUEST" e senha "" (vazia).
// Para sua rede local/placa real, troque aqui.
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

// ===== PWM =====
#define PWM_FREQ_HZ   20000
#define PWM_RES_BITS  8
#define PWM_CH_M1     0
#define PWM_CH_M2     1

// ===== Calibração (malha aberta) =====
#define CALIB_VEL_CM_S         20.0f   // cm/s @ PWM move
#define CALIB_PWM_MOVE         255     // 0..255 (~60%)
#define K_GIRO_MS_POR_GRAU     8.5f    // ms por graudw

// ===== Log =====
#define LOG_PREFIX "[CTRL] "
