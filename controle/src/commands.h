#pragma once
#include <Arduino.h>

enum class CmdType : uint8_t { NONE=0, STOP_ALL, DEPOSIT_EGG, FORWARD, TURN_LEFT, TURN_RIGHT }; 

struct Command {
  CmdType type = CmdType::NONE;
  int distancia;
};