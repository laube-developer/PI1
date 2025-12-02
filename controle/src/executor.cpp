#include "executor.h"
#include "command_queue.h"
#include "motors.h"
#include "config.h"

namespace executor {

  void setup() {
    
  }

  void tick() {
    while (!cmdq::empty()) {
      Command c;
      if (!cmdq::pop(c)) break;

      if (c.type == CmdType::FORWARD) {
        Serial.printf("Andar: %dcm\n", c.distancia);
        //implementar andar para frente
        delay(1000);
        
      } else if (c.type == CmdType::TURN_LEFT) {
        //implementar virar esquerda
        Serial.printf("Virar Esquerda\n");
        delay(1000);
        
        
      } else if (c.type == CmdType::TURN_RIGHT) {
        //implementar virar direita
        Serial.printf("Virar Direita\n");
        delay(1000);
        
        
      } else if (c.type == CmdType::DEPOSIT_EGG) { 
        //implementar depositar o ovo
        Serial.printf("Depositar Ovo\n");
        delay(1000);
        
      } else if (c.type == CmdType::STOP_ALL) {
        //implementar parar o carrinho
        Serial.printf("Parada\n");
        delay(1000);
        
      }
    }
  }

  void emergencyStop() { 
    cmdq::clear();
    motors::pararDoisMotores();
    Serial.print("Parada de emergência.");
   }

}