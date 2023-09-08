
# Shopper Desafio Tecnico

Projeto Desenvolvido para o Desafio Tecnico, onde foi pedido a criação de um sistema de upload de arquivos csv para a atualização dos valores dos produtos.




## Setup
- Node.js e npm instalados.
- MySQL instalado.

## Instalação

1. Clone o repositório.

    git clone https://github.com/seu-usuario/seu-projeto.git

2. Entre na pasta client.
2.1 Instale as dependências.

    npm install

3. Entre na pasta server.
3.1 Instale as dependências.

    npm install

4. Crie um arquivo .env na raiz do projeto e configure as variáveis de ambiente necessárias. (Exemplo abaixo)

    DB_HOST=seu-host

    DB_USER=seu-usuario

    DB_PASSWORD=sua-senha

    DB_DATABASE=seu-banco-de-dados

## Funcionalidades
1. Upload de Arquivo de Precificação:
- O sistema permite que o usuário faça o upload de um arquivo CSV contendo informações sobre os produtos e seus novos preços.

2. Validação do Arquivo:

- Após o upload, o sistema realiza uma série de verificações para garantir a integridade e validade dos dados:
- Todos os campos necessários estão presentes.
- Os códigos de produtos informados existem no banco de dados.
- Os preços estão preenchidos e são valores numéricos válidos.
- O arquivo respeita as regras de negócio previamente definidas.

3. Exibição das informações
- O sistema apresenta ao usuário uma lista de produtos que foram enviados no arquivo, incluindo: Código do Produto,Nome,Preço Atual e Novo Preço.

4. Exibição de Erros
- Se alguma regra de validação for quebrada, o sistema informa ao usuário qual regra foi violada e qual produto está envolvido.

5. Atualização de preços
- Caso todos os produtos no arquivo estejam validados e sem regras quebradas, o sistema permite que o usuário atualize os preços no banco de dados.

