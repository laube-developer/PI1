#include "motors.h"

namespace motors {

#if SIMULATE

  void setup() {
    Serial.println(LOG_PREFIX "SIMULATE=1 -> logs apenas (sem GPIO).");
  }

  void setVel(uint8_t left, uint8_t right) {
    Serial.printf(LOG_PREFIX "SET_VEL L=%u R=%u\n", left, right);
  }

  void depositEgg() {
    #if SIMULATE 
      Serial.println(LOG_PREFIX "DEPOSIT EGG (Motor de depósito acionado)");
    #else // Implementação de "ligar" o motor por 500ms
      digitalWrite(EGG_MOTOR_PIN, HIGH);
      delay(500); // Roda por 500ms 
      digitalWrite(EGG_MOTOR_PIN, LOW);
    #endif
  }

  void stop() {
    Serial.println(LOG_PREFIX "STOP ALL");
  }

#else

  static inline void setPwm(uint8_t ch, uint8_t duty) { ledcWrite(ch, duty); }

  void setup() {
    Serial.println(LOG_PREFIX "SIMULATE=0 -> habilitando GPIO/PWM");
    pinMode(M1_DIR_A, OUTPUT); pinMode(M1_DIR_B, OUTPUT);
    pinMode(M2_DIR_A, OUTPUT); pinMode(M2_DIR_B, OUTPUT);

    // Configuração do motor para depósito do ovo
    pinMode(EGG_MOTOR_PIN, OUTPUT); 
    digitalWrite(EGG_MOTOR_PIN, LOW); 

    ledcSetup(PWM_CH_M1, PWM_FREQ_HZ, PWM_RES_BITS);
    ledcAttachPin(M1_PWM, PWM_CH_M1);
    ledcSetup(PWM_CH_M2, PWM_FREQ_HZ, PWM_RES_BITS);
    ledcAttachPin(M2_PWM, PWM_CH_M2);

    digitalWrite(M1_DIR_A, HIGH); digitalWrite(M1_DIR_B, LOW);
    digitalWrite(M2_DIR_A, HIGH); digitalWrite(M2_DIR_B, LOW);

    stop();
  }

  void setVel(uint8_t left, uint8_t right) {
    setPwm(PWM_CH_M1, left);
    setPwm(PWM_CH_M2, right);
  }

  void stop() {
    setPwm(PWM_CH_M1, 0);
    setPwm(PWM_CH_M2, 0);
  }

#endif