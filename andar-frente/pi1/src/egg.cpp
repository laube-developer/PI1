#include "egg.h"
#include "config.h"
#include <Deneyap_Servo.h>
#include <Arduino.h>
 
Servo myservo;                  // Servo için class tanımlanması

void setupEggMotor() {  
  myservo.attach(EGG_MOTOR_PIN);           // Servo motorun D9 pinine bağlanması  /*attach(pin, channel=0, freq=50, resolution=12) olarak belirlenmiştir. Kullandığınız motora göre değiştirebilirsiniz */
  int estado = digitalRead(EGG_MOTOR_PIN);
  Serial.print("Egg motor pin state: "); Serial.println(estado);
  myservo.write(0);                      // Servo motorun başlangıç pozisyonu
  delay(1000);
    //pinMode(EGG_MOTOR_PIN, OUTPUT);
}

void depositEgg() { 
  myservo.write(60);
    delay(1000); // Zaman ayarı
    myservo.write(0);
    delay(1000);
    // digitalWrite(EGG_MOTOR_PIN, HIGH);
    // delay(1000); // Zaman ayarı
    // digitalWrite(EGG_MOTOR_PIN, LOW);
    // delay(1000);
}