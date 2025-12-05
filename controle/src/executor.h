#pragma once

#include <Arduino.h>
#include "commands.h"

namespace executor {
  void setup();
  void tick();          
  void emergencyStop();
}