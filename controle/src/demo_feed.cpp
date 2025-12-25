#include "demo_feed.h"
#include "command_queue.h"
#include "commands.h"
#include "config.h"

struct Step {
  uint16_t duration_ms;
  uint8_t  left;
  uint8_t  right;
};

static const Step SEQ[] = {
  { 1000,  0,   0   },
  { 1500,  120,  90 },  
  { 2000,  150, 130 },  
  { 1500,  160, 160 },  
  { 1200,  180, 160 },  
  { 1000,   80,  80 },  
  {  800,    0,   0 }   
};
static constexpr size_t N = sizeof(SEQ)/sizeof(SEQ[0]);

static size_t idx = 0;
static unsigned long tStart = 0;
static bool started = false;

namespace demo {

  void setup() {
    idx = 0;
    tStart = millis();
    started = false;
  }

  void tick() {
    if (idx >= N) return; 

    const unsigned long now = millis();

    if (!started) {
      Command c;
      c.type = CmdType::SET_VEL;
      c.left = SEQ[idx].left;
      c.right = SEQ[idx].right;
      cmdq::push(c);
      Serial.printf(LOG_PREFIX "DEMO step %u -> L=%u R=%u for %ums\n",
        (unsigned)idx, c.left, c.right, (unsigned)SEQ[idx].duration_ms);
      started = true;
      tStart = now;
      return;
    }

    if (now - tStart >= SEQ[idx].duration_ms) {
      idx++;

      if (idx >= N) {
        // Sequência terminou, primeiro depositar o ovo
        Command d; d.type = CmdType::DEPOSIT_EGG; 
        cmdq::push(d);                            
        Serial.println(LOG_PREFIX "DEMO depositing egg..."); 

        // Depois parar tudo
        Command s; s.type = CmdType::STOP_ALL;
        cmdq::push(s);
        Serial.println(LOG_PREFIX "DEMO finished (STOP)");
        return;
      }
      Command c;
      c.type = CmdType::SET_VEL;
      c.left = SEQ[idx].left;
      c.right = SEQ[idx].right;
      cmdq::push(c);
      Serial.printf(LOG_PREFIX "DEMO step %u -> L=%u R=%u for %ums\n",
        (unsigned)idx, c.left, c.right, (unsigned)SEQ[idx].duration_ms);
      tStart = now;
    }
  }

} 