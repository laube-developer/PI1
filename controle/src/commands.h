#pragma once
#include <Arduino.h>

enum class CmdType : uint8_t { NONE=0, FORWARD, TURN, STOP };

struct Command {
  CmdType type = CmdType::NONE;
  float   value = 0.0f; 
};
