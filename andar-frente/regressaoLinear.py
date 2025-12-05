import numpy as np
import matplotlib.pyplot as plt

# 1. Dados de Exemplo
# Variável Independente (X)
X = np.array([1, 2, 3, 4, 5])
# Variável Dependente (Y)
Y = np.array([2, 4, 5, 4, 5])

# --- FUNÇÃO PARA REGRESSÃO LINEAR ---
def calcular_regressao(x, y):
    """Calcula os coeficientes A e B e a linha de regressão."""
    
    # Número de observações (n)
    n = np.size(x)

    # 2. Cálculo da Média de X e Y
    media_x = np.mean(x)
    media_y = np.mean(y)

    # 3. Cálculo do Cross-Deviance (numerador para A) e do Variance (denominador para A)
    # Soma dos produtos dos desvios:
    SS_xy = np.sum(y*x) - n*media_y*media_x
    # Soma dos quadrados dos desvios de x:
    SS_xx = np.sum(x*x) - n*media_x*media_x
    
    # 4. Cálculo dos Coeficientes
    # Coeficiente A (inclinação): A = Cov(X, Y) / Var(X)
    if SS_xx == 0:
        # Evitar divisão por zero se todos os valores de X forem iguais
        A = 0
    else:
        A = SS_xy / SS_xx
    
    # Coeficiente B (intercepto): B = media_y - A * media_x
    B = media_y - A * media_x

    return (A, B)

# Executa o cálculo
A, B = calcular_regressao(X, Y)

# 5. Criação da Linha de Regressão
# A linha de regressão (y_predito) é calculada como y_predito = A * X + B
Y_predito = A * X + B

# 6. Geração do Gráfico
plt.figure(figsize=(8, 6))

# Plotar os pontos originais (scatter plot)
plt.scatter(X, Y, color='blue', marker='o', label='Pontos de Dados Originais')

# Plotar a linha de regressão
plt.plot(X, Y_predito, color='red', linewidth=2, label='Linha de Regressão ($\hat{y} = Ax + B$)')

# Adicionar rótulos e título
plt.xlabel('Variável Independente (X)')
plt.ylabel('Variável Dependente (Y)')
plt.title('Regressão Linear Simples')
plt.legend()
plt.grid(True)
plt.show()

# 7. Exibição dos Resultados dos Coeficientes
print(f"--- Resultados dos Coeficientes ---")
print(f"Coeficiente A (Inclinação): {A:.4f}")
print(f"Coeficiente B (Intercepto): {B:.4f}")
print(f"A equação da linha é: Y = {A:.4f} * X + {B:.4f}")