#pragma once

const float Kp = 4.5f;      // Ganho Proporcional   (Ajuste Rápido)
const float Ki = 0.0f;      // Ganho Integral       (Elimina Erro Estático)
const float Kd = 0.0f;      // Ganho Derivativo     (Amortece Oscilações)

extern float erroAcumulado;
extern float erroAnterior;

float pid_control(float anguloAtual, float anguloDesejado, unsigned long dt);