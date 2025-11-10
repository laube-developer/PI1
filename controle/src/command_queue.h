#pragma once
#include "commands.h"

namespace cmdq {
  constexpr size_t CAPACITY = 16;
  void   clear();
  bool   push(const Command& c);
  bool   pop(Command& out);
  bool   empty();
  size_t size();
}
