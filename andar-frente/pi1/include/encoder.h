// encoders.h

#ifndef ENCODERS_H
#define ENCODERS_H

#include <Arduino.h> // Necessário para tipos básicos do Arduino (ex: long, int, void)


// --- Estrutura de Dados ---
/**
 * @brief Estrutura para armazenar a contagem de pulsos de ambos os encoders.
 */
struct DadosEncoder {
    long pulsosEsquerdo;
    long pulsosDireito;
    long distanciaTotalEsquerdo;
    long distanciaTotalDireito;
};

// --- Protótipos das Funções (Interface Pública) ---

/**
 * @brief Inicializa os pinos dos encoders e configura as interrupções.
 */
void inicializarEncoders();

/**
 * @brief Lê de forma segura os dados atuais dos encoders usando exclusão mútua simples.
 * @return Uma estrutura DadosEncoder contendo as contagens atuais.
 */
DadosEncoder lerDadosEncoders();

/**
 * @brief Exibe (ou envia via Serial/Wi-Fi) os dados dos encoders.
 * @param dados A estrutura DadosEncoder a ser enviada/exibida.
 */
void enviarDadosEncoders(DadosEncoder dados);

#endif // ENCODERS_H