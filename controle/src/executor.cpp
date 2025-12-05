#include "executor.h"
#include "command_queue.h"
#include "motors.h"
#include "config.h"
#include "egg.h"
#include "giroscopio.h"
#include "pid.h"
#include "encoder.h"

#define MAX_VEL_BASE 160

void andarPraFrente(int distancia)
{

  zerarGiroscopio();
  resetEncoder();

  bool concluido = false;
  int contador = 130;
  unsigned long int tempo = millis();

  while (!concluido)
  {
    if (millis() - tempo >= 100)
    {
      // Aumenta, mas limita o contador ao valor máximo
      contador = constrain(contador + 5, 130, MAX_VEL_BASE);
      tempo = millis();
    };

    dados estadoGiro = getAnguloAtual();
    float anguloAtual = estadoGiro.angulo;
    unsigned long deltaT = estadoGiro.deltaTempo;

    float ajusteF = pid_control(anguloAtual, 0.0f, deltaT);
    int ajuste = (int)round(ajusteF);

    // O ajuste positivo diminui a roda esquerda e aumenta a direita (vira à direita)
    // O ajuste negativo aumenta a roda esquerda e diminui a direita (vira à esquerda)

    int velE = constrain(contador - ajuste, 0, 165);
    int velD = constrain(contador + ajuste + 10, 0, 220);

    motors::andarDoisMotoresFrente(velE, velD);
    float distanciaTotal = lerDadosEncoders().distanciaEsquerdaCm;

    if (distanciaTotal >= (float)distancia)
    {
      concluido = true;
      break;
    }
  }

  motors::andarDoisMotoresFrente(1, 1);
  zerarGiroscopio();
  resetEncoder();
}

void virar_direita()
{
  zerarGiroscopio();
  resetEncoder();

  bool concluido = false;

  while (!concluido)
  {
    dados estadoGiro = getAnguloAtual();

    if (abs(estadoGiro.angulo) >= 70)
    {
      concluido = true;
      break;
    }

    if (estadoGiro.angulo > 90.0)
    {
      motors::andarDoisMotoresTras(255, 0);
    }
    else
    {
      motors::andarDoisMotoresFrente(130, 255);
    }
  }

  motors::andarDoisMotoresFrente(1, 1);
  zerarGiroscopio();
  resetEncoder();
}

void virar_esquerda()
{
  zerarGiroscopio();
  resetEncoder();
  bool concluido = false;

  while (!concluido)
  {

    dados estadoGiro = getAnguloAtual();

    if (abs(estadoGiro.angulo) >= 85)
    {
      concluido = true;
      break;
    }

    if (estadoGiro.angulo > 90.0)
    {
      motors::andarDoisMotoresTras(0, 255);
    }
    else
    {
      motors::andarDoisMotoresFrente(255, 140);
    }
  }

  motors::pararDoisMotores();
  zerarGiroscopio();
  resetEncoder();
}

namespace executor
{

  void setup() {}

  void tick()
  {
    while (!cmdq::empty())
    {
      Command c;
      if (!cmdq::pop(c))
        break;

      if (c.type == CmdType::FORWARD)
      {
        Serial.printf("Andar: %dcm\n", c.distancia);
        // implementar andar para frente
        andarPraFrente(c.distancia);
        delay(1000);
      }
      else if (c.type == CmdType::TURN_LEFT)
      {
        // implementar virar esquerda
        Serial.printf("Virar Esquerda\n");
        virar_esquerda();
        delay(1000);
      }
      else if (c.type == CmdType::TURN_RIGHT)
      {
        // implementar virar direita
        Serial.printf("Virar Direita\n");
        virar_direita();
        delay(1000);
      }
      else if (c.type == CmdType::DEPOSIT_EGG)
      {
        // implementar depositar o ovo
        Serial.printf("Depositar Ovo\n");
        depositEgg();
        delay(1000);
      }
      else if (c.type == CmdType::STOP_ALL)
      {
        // implementar parar o carrinho
        Serial.printf("Parada\n");
        emergencyStop();
        delay(1000);
      }
    }
  }

  void emergencyStop()
  {
    cmdq::clear();
    motors::pararDoisMotores();
    Serial.print("Parada de emergência.");
    zerarGiroscopio();
  }

}