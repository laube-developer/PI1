#pragma once
#include <Arduino.h>

enum class CmdType : uint8_t { NONE=0, SET_VEL, STOP_ALL };

struct Command {
  CmdType type = CmdType::NONE;
  uint8_t left  = 0;
  uint8_t right = 0;
};