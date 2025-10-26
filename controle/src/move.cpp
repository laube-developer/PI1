#include "move.h"
#include "motors.h"
#include "config.h"

namespace move {

  void forwardCm(float cm) {
    if (cm <= 0) return;
    const unsigned long t_ms = (unsigned long)((cm / CALIB_VEL_CM_S) * 1000.0f);
    Serial.printf(LOG_PREFIX "MOVE forward %.1f cm -> %lu ms @PWM=%d\n",
                  cm, t_ms, CALIB_PWM_MOVE);
    motors::forward(CALIB_PWM_MOVE);
    delay(t_ms);
    motors::stop();
  }

  void turnDeg(float deg) {
    if (deg == 0) return;
    const float d = fabsf(deg);
    const unsigned long t_ms = (unsigned long)(d * K_GIRO_MS_POR_GRAU);
    Serial.printf(LOG_PREFIX "TURN %s %.1f deg -> %lu ms @PWM=%d\n",
                  (deg>0?"right":"left"), d, t_ms, CALIB_PWM_MOVE);

    if (deg > 0) motors::turnRight(CALIB_PWM_MOVE);
    else         motors::turnLeft(CALIB_PWM_MOVE);

    delay(t_ms);
    motors::stop();
  }

  void stop() {
    Serial.println(LOG_PREFIX "STOP called");
    motors::stop();
  }

}
