#include "egg.h"
#include "config.h"
#include <Deneyap_Servo.h>
#include <Arduino.h>
#include "motors.h"

Servo myservo;

void setupEggMotor()
{

    myservo.attach(EGG_MOTOR_PIN);
    int estado = digitalRead(EGG_MOTOR_PIN);
    Serial.print("Egg motor pin state: ");
    Serial.println(estado);
    delay(1000);
    myservo.write(90);
    delay(1000);
    // pinMode(EGG_MOTOR_PIN, OUTPUT);
}

void depositEgg()
{
    myservo.write(0);
    delay(1000); // Zaman ayarı
    myservo.write(90);
    delay(1000);
    // digitalWrite(EGG_MOTOR_PIN, HIGH);
    // delay(1000); // Zaman ayarı
    // digitalWrite(EGG_MOTOR_PIN, LOW);
    // delay(1000);
}