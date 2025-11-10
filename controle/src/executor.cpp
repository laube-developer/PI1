#include "executor.h"
#include "command_queue.h"
#include "motors.h"
#include "config.h"

namespace executor {

  void setup() {}

  void tick() {
    while (!cmdq::empty()) {
      Command c;
      if (!cmdq::pop(c)) break;

      if (c.type == CmdType::SET_VEL) {
        motors::setVel(c.left, c.right);
      } else if (c.type == CmdType::STOP_ALL) {
        motors::stop();
      } else if (c.type == CmdType::DEPOSIT_EGG) { 
        motors::depositEgg();                     
      }
    }
  }

  void emergencyStop() { 
    cmdq::clear();
    motors::stop();
   }

}
