/*
    Cálculo do Bias (offset estático) e Dead Band do Giroscópio no eixo Z
    O bias é o valor médio das leituras quando o giroscópio está parado.
    A dead band é o desvio padrão das leituras, representando o ruído do sensor.
*/

#pragma once

struct GyroCalib {
    float bias;
    float deadband;
};

GyroCalib calibrarGiro();