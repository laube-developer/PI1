/*
    Giroscópio MPU-6050 - Teste de Fator de Escala
    Este teste ajuda a determinar o fator de escala (K_RATE) para o giroscópio.

    Para realizar este teste use uma parede ou outra superfície fixa como referência.
    Gire o giroscópio em um ângulo conhecido (por exemplo, 90 graus).
    Verifique o valor lido pelo giroscópio e ajuste o K_RATE conforme necessário.
*/

#pragma once
void k_rate_calibrado (float angulo_referencia);
float testarFatorDeEscala(float angulo_referencia);