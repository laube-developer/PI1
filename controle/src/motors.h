#pragma once
#include <Arduino.h>
#include "config.h"

namespace motors {
  void setup();

  void setVel(uint8_t left, uint8_t right);

  void stop();
}