#pragma once
#include <Arduino.h>
#include "config.h"

namespace motors {
    void initialize();

    void andarMotor1Frente();
    
    void andarMotor1Tras();
    
    void pararMotor1();
    
    void andarMotor2Frente();
    
    void andarMotor2Tras();
    
    void pararMotor2();
    
    void andarDoisMotoresFrente();
    
    void pararDoisMotores();

    void virarDireita();

    void virarEsquerda();
}