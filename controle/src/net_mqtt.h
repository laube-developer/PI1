#pragma once
#include <Arduino.h>

namespace netmqtt {
  void setup();   // wifi + mqtt
  void tick();    // manter conexões e processar mensagens
}
