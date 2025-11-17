#pragma once

typedef struct {
  float x;
  float y;
  float z;
} DadosGiroscopio;


void setupGiroscopio();

DadosGiroscopio lerGiroscopio();

void enviarDadosGiroscopio(DadosGiroscopio dados);
