#include "Arduino.h"
#include "motors.h"
#include "config.h"

// ###############################################################
// AJUSTE DE VELOCIDADE:
// (5.0V / 8.27V) * 255 = 154
const int VELOCIDADE_SEGURA = 200; // (60% de 255, ~5.0V)
const int VELOCIDADE_MOTOR_DIREITO = 200;
const int VELOCIDADE_MOTOR_ESQUERDO = 155;

namespace motors {
    void initialize(){
    // Pinos de direção como saída
      pinMode(IN1, OUTPUT);
      pinMode(IN2, OUTPUT);
      pinMode(IN3, OUTPUT);
      pinMode(IN4, OUTPUT);
    
      // Pinos de velocidade PWM como saída
      pinMode(ENA, OUTPUT);
      pinMode(ENB, OUTPUT);
      
      // Motores parados inicialmente
      pararDoisMotores();
      delay(1000);
    }
    
    void andarMotor1Frente() {
      digitalWrite(IN1, HIGH);
      digitalWrite(IN2, LOW);
      analogWrite(ENA, VELOCIDADE_MOTOR_ESQUERDO); 
    }
    
    // void andarMotor1Tras() {
    //   digitalWrite(IN1, LOW);
    //   digitalWrite(IN2, HIGH);
    //   analogWrite(ENA, VELOCIDADE_SEGURA); 
    // }
    
    void pararMotor1() {
      digitalWrite(IN1, LOW);
      digitalWrite(IN2, LOW);
      analogWrite(ENA, 0); 
    }
    
    void andarMotor2Frente() {
      digitalWrite(IN3, HIGH);
      digitalWrite(IN4, LOW);
      analogWrite(ENB, VELOCIDADE_MOTOR_DIREITO); 
    }
    
    // void andarMotor2Tras() {
    //   digitalWrite(IN3, LOW);
    //   digitalWrite(IN4, HIGH);
    //   analogWrite(ENB, VELOCIDADE_SEGURA); 
    // }
    
    void pararMotor2() {
      digitalWrite(IN3, LOW);
      digitalWrite(IN4, LOW);
      analogWrite(ENB, 0); 
    }
    
    void andarDoisMotoresFrente(){
      digitalWrite(IN1, HIGH);
      digitalWrite(IN2, LOW);
      digitalWrite(IN3, HIGH);
      digitalWrite(IN4, LOW);
    
      analogWrite(ENA, VELOCIDADE_MOTOR_ESQUERDO);
      analogWrite(ENB, VELOCIDADE_MOTOR_DIREITO);
    }
    
    void pararDoisMotores(){
      digitalWrite(IN1, LOW);
      digitalWrite(IN2, LOW);
      digitalWrite(IN3, LOW);
      digitalWrite(IN4, LOW);
      
      analogWrite(ENA, 0);
      analogWrite(ENB, 0);
    }

    void virarDireita(){
        andarMotor1Frente();
        delay(525);
        pararMotor1();
    }

    void virarEsquerda(){
        motors::andarMotor2Frente();
        delay(530);
        motors::pararMotor2();
    }
}