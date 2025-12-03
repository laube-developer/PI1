#pragma once

struct dados {
    float angulo;
    unsigned long deltaTempo;
};

void setupGiroscopio();

float lerGiroscopio();

void enviarDadosGiroscopio(float dados);

dados getAnguloAtual();

void calibracaoGiroscopio();

void zerarGiroscopio();