#pragma once
#include <Arduino.h>
#include "config.h"

namespace motors {

  void setup();

  void forward(uint8_t pwm);
  void backward(uint8_t pwm);

  void turnLeft(uint8_t pwm);
  void turnRight(uint8_t pwm);

  void stop();
}
