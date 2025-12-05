#pragma once

const float Kp = 8.0f;      // Ganho Proporcional   (Ajuste Rápido)
const float Ki = 0.45f;      // Ganho Integral       (Elimina Erro Estático)
const float Kd = 0.15f;      // Ganho Derivativo     (Amortece Oscilações)

extern float erroAcumulado;
extern float erroAnterior;

float pid_control(float anguloAtual, float anguloDesejado, unsigned long dt);