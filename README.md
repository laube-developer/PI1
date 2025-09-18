# Projeto Integrador de Engenharia 1
Repositório para o projeto da disciplina Projeto Integrador de Engenharia 1

## Como baixar o repositório
Abra uma pasta no seu computador no terminal e execute os seguintes comandos:

    git clone https://github.com/laube-developer/PI1.git
    cd PI1
    git branch develop

## Orientações para trabalhar com o repositório

O projeto terá duas branchs principais, a *main* e a *develop*. Antes de fazer qualquer modificação, verifique se está na branch *develop*. Após fazer as alterações, execute os seguintes comandos:

    #mapear arquivos para serem enviados para o repositório
    git add *
    #ou
    git add ./pasta/para/arquivo.txt

    #cria um commit com essas modificações
    git commit -m "Adição do algorítmo do mapa"
    
    #subir para o repositório remoto
    git push origin develop

## Links importantes
- [Documentação](/documentacao)


