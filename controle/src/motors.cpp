#include "motors.h"

namespace motors {

#if SIMULATE

  void setup() {
    Serial.println(LOG_PREFIX "SIMULATE=1 -> sem GPIO. Apenas logs.");
  }

  void forward(uint8_t pwm) {
    Serial.printf(LOG_PREFIX "forward @PWM=%u\n", pwm);
  }
  void backward(uint8_t pwm) {
    Serial.printf(LOG_PREFIX "backward @PWM=%u\n", pwm);
  }
  void turnLeft(uint8_t pwm) {
    Serial.printf(LOG_PREFIX "turnLeft @PWM=%u\n", pwm);
  }
  void turnRight(uint8_t pwm) {
    Serial.printf(LOG_PREFIX "turnRight @PWM=%u\n", pwm);
  }
  void stop() {
    Serial.println(LOG_PREFIX "stop");
  }

#else

  static void setPwm(uint8_t ch, uint8_t duty) {
    ledcWrite(ch, duty);
  }

  void setup() {
    Serial.println(LOG_PREFIX "SIMULATE=0 -> hardware GPIO/PWM habilitado.");

    pinMode(M1_DIR_A, OUTPUT);
    pinMode(M1_DIR_B, OUTPUT);
    pinMode(M2_DIR_A, OUTPUT);
    pinMode(M2_DIR_B, OUTPUT);

    ledcSetup(PWM_CH_M1, PWM_FREQ_HZ, PWM_RES_BITS);
    ledcAttachPin(M1_PWM, PWM_CH_M1);

    ledcSetup(PWM_CH_M2, PWM_FREQ_HZ, PWM_RES_BITS);
    ledcAttachPin(M2_PWM, PWM_CH_M2);

    stop();
  }

  void forward(uint8_t pwm) {
    digitalWrite(M1_DIR_A, HIGH); digitalWrite(M1_DIR_B, LOW);
    digitalWrite(M2_DIR_A, HIGH); digitalWrite(M2_DIR_B, LOW);
    setPwm(PWM_CH_M1, pwm);
    setPwm(PWM_CH_M2, pwm);
  }

  void backward(uint8_t pwm) {
    digitalWrite(M1_DIR_A, LOW); digitalWrite(M1_DIR_B, HIGH);
    digitalWrite(M2_DIR_A, LOW); digitalWrite(M2_DIR_B, HIGH);
    setPwm(PWM_CH_M1, pwm);
    setPwm(PWM_CH_M2, pwm);
  }

  void turnLeft(uint8_t pwm) {
    // esquerda p/ trás, direita p/ frente
    digitalWrite(M1_DIR_A, LOW);  digitalWrite(M1_DIR_B, HIGH);
    digitalWrite(M2_DIR_A, HIGH); digitalWrite(M2_DIR_B, LOW);
    setPwm(PWM_CH_M1, pwm);
    setPwm(PWM_CH_M2, pwm);
  }

  void turnRight(uint8_t pwm) {
    // esquerda p/ frente, direita p/ trás
    digitalWrite(M1_DIR_A, HIGH); digitalWrite(M1_DIR_B, LOW);
    digitalWrite(M2_DIR_A, LOW);  digitalWrite(M2_DIR_B, HIGH);
    setPwm(PWM_CH_M1, pwm);
    setPwm(PWM_CH_M2, pwm);
  }

  void stop() {
    setPwm(PWM_CH_M1, 0);
    setPwm(PWM_CH_M2, 0);
  }

#endif

} 
