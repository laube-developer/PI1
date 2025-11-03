#pragma once

// ===== Toggle de simulação =====
// 1 = sem hardware: só imprime no Serial (recomendado agora)
// 0 = com hardware: usa pinos e PWM
#define SIMULATE 1

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


// ===== Pinos de motor (quando SIMULATE=0) =====
#define M1_DIR_A 25
#define M1_DIR_B 26
#define M1_PWM   27

#define M2_DIR_A 32
#define M2_DIR_B 33
#define M2_PWM   14

#define EGG_MOTOR_PIN  13

// ===== PWM =====
#define PWM_FREQ_HZ   20000
#define PWM_RES_BITS  8
#define PWM_CH_M1     0
#define PWM_CH_M2     1

// ===== Calibração (malha aberta) =====
#define CALIB_VEL_CM_S         20.0f   // cm/s @ PWM move
#define CALIB_PWM_MOVE         153     // 0..255 (~60%)
#define K_GIRO_MS_POR_GRAU     8.5f    // ms por grau

// ===== Log =====
#define LOG_PREFIX "[CTRL] "
