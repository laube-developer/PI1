#include "command_queue.h"

namespace cmdq {
  static Command buffer[CAPACITY];
  static size_t head=0, tail=0, count=0;

  void clear(){ head=tail=count=0; }

  bool push(const Command& c){
    if(count>=CAPACITY) return false;
    buffer[tail]=c; tail=(tail+1)%CAPACITY; count++; return true;
  }

  bool pop(Command& out){
    if(count==0) return false;
    out=buffer[head]; head=(head+1)%CAPACITY; count--; return true;
  }

  bool empty(){ return count==0; }
  size_t size(){ return count; }
}