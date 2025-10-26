#include "executor.h"
#include "command_queue.h"
#include "config.h"
#include "motors.h"

namespace executor {

  enum class State : uint8_t { IDLE, RUN_FWD, RUN_TURN };

  static State st = State::IDLE;
  static unsigned long tStart = 0;
  static unsigned long tDurMs = 0;
  static Command cur{};

  static void startCommand(const Command& c) {
    cur = c;

    switch (c.type) {
      case CmdType::FORWARD: {
        tDurMs = (unsigned long)((c.value / CALIB_VEL_CM_S) * 1000.0f);
        Serial.printf(LOG_PREFIX "EXEC start FORWARD %.1f cm -> %lu ms @PWM=%d\n",
                      c.value, tDurMs, CALIB_PWM_MOVE);
        motors::forward(CALIB_PWM_MOVE);
        st = State::RUN_FWD;
        tStart = millis();
        break;
      }

      case CmdType::TURN: {
        const float d = fabsf(c.value);
        tDurMs = (unsigned long)(d * K_GIRO_MS_POR_GRAU);
        Serial.printf(LOG_PREFIX "EXEC start TURN %s %.1f deg -> %lu ms @PWM=%d\n",
                      (c.value>0 ? "right" : "left"),
                      d, tDurMs, CALIB_PWM_MOVE);
        if (c.value > 0) motors::turnRight(CALIB_PWM_MOVE);
        else             motors::turnLeft(CALIB_PWM_MOVE);
        st = State::RUN_TURN;
        tStart = millis();
        break;
      }

      case CmdType::STOP: {
        Serial.println(LOG_PREFIX "EXEC STOP immediate");
        motors::stop();
        st = State::IDLE;
        tStart = 0; tDurMs = 0;
        break;
      }

      default:
        st = State::IDLE;
        break;
    }
  }

  void setup() {
    st = State::IDLE;
    tStart = 0;
    tDurMs = 0;
  }

  void tick() {
    if (st == State::IDLE && !cmdq::empty()) {
      Command nxt;
      if (cmdq::pop(nxt)) startCommand(nxt);
    }

    if (st == State::RUN_FWD || st == State::RUN_TURN) {
      const unsigned long elapsed = millis() - tStart;
      if (elapsed >= tDurMs) {
        motors::stop();
        Serial.println(LOG_PREFIX "EXEC done");
        st = State::IDLE;
        tStart = 0; tDurMs = 0;
      }
    }
  }

  void emergencyStop() {
    motors::stop();
    st = State::IDLE;
    tStart = 0; tDurMs = 0;
    Serial.println(LOG_PREFIX "EMERGENCY STOP");
  }

  bool isBusy() { return st != State::IDLE; }

  bool currentCommand(Command& out) {
    if (st == State::IDLE) return false;
    out = cur; return true;
  }

} 
