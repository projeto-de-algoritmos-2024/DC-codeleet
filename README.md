# ComTexto ( qualquer semelhança com o jogo contexto é mera coincidencia ) 

**Número da Lista**: 22<br>
**Conteúdo da Disciplina**: D&C<br>

## Alunos

| Matrícula  | Aluno                      |
| ---------- | -------------------------- |
| 21/1031646 | Bruno Medeiros de Oliveira |
| 21/1031762 | Leonardo Lago Moreno       |

## Sobre 
Este projeto é um jogo de adivinhação de palavras desenvolvido como uma aplicação web interativa. O objetivo principal do usuário é adivinhar uma palavra secreta, baseada em sugestões e dicas fornecidas pelo sistema. Bem similar a outros jogos webs bem famosos.
## Vídeo

[![Ver video](https://img.youtube.com/vi/YekAtE2SAvk/0.jpg)](https://www.youtube.com/watch?v=YekAtE2SAvk)

## Screenshots
![Captura de Tela 2024-08-19 às 22 56 51](https://github.com/user-attachments/assets/bd437c8d-c61c-4006-8d89-e71897bf9a91)

![Captura de Tela 2024-08-19 às 22 58 02](https://github.com/user-attachments/assets/ab37d21a-9632-45d8-9444-4ee8c5b7b9f9)

![comtexto](https://github.com/user-attachments/assets/aa3cf50c-86c8-4428-8950-7d694379f1c4)

## Instalação 
**Linguagem**: Typescript<br>
**Framework**: Next<br>

#### 1. **Pré-requisitos**

Antes de iniciar a instalação, verifique se você tem os seguintes softwares instalados em seu ambiente:

- **Node.js** (versão 14.x ou superior)
- **npm** ou **Yarn** (gerenciador de pacotes do Node.js)

Você pode verificar se esses requisitos estão instalados executando os seguintes comandos no terminal:

```bash
node -v
npm -v
```

Se você preferir usar o Yarn, verifique a versão com:

```bash
yarn -v
```

#### 2. **Clonar o Repositório**

Clone o repositório do projeto em sua máquina local usando o Git. Se você ainda não possui o Git instalado, pode baixá-lo em [git-scm.com](https://git-scm.com/).

No terminal, execute:

```bash
git clone https://github.com/projeto-de-algoritmos-2024/DC-comtexto.git
```

#### 3. **Navegar para o Diretório do Projeto**

Após clonar o repositório, navegue até o diretório do projeto:

```bash
cd DC-comtexto
```

#### 4. **Instalar Dependências**

Agora, instale todas as dependências necessárias do projeto. Você pode usar npm ou Yarn, dependendo de sua preferência:

- Com **npm**:

  ```bash
  npm install
  ```

- Com **Yarn**:

  ```bash
  yarn install
  ```

Isso instalará todas as bibliotecas e pacotes que o projeto requer.


#### 5. **Executar a Aplicação em Desenvolvimento**

Para iniciar o servidor de desenvolvimento e ver a aplicação em ação, execute o seguinte comando:

- Com **npm**:

  ```bash
  npm run dev
  ```

- Com **Yarn**:

  ```bash
  yarn dev
  ```

Isso iniciará o servidor de desenvolvimento e você poderá acessar a aplicação em seu navegador através de `http://localhost:3000`.

#### 6. **Acessar a Aplicação**

Abra o navegador e navegue até:

```url
http://localhost:3000
```

Agora você deve ver a aplicação rodando em seu ambiente local.



## Uso 


#### 1. **Início do Jogo**

- **Carregamento Inicial**: Quando você acessa o jogo pela primeira vez, ele carrega uma palavra secreta aleatória. Durante o carregamento, uma mensagem de "Carregando..." será exibida. Você não poderá interagir com o jogo até que a palavra esteja carregada.

#### 2. **Interface de Jogo**

- **Campo de Palpite**: Quando o carregamento inicial for concluído, você verá um campo de entrada onde poderá digitar seu palpite. Este campo é onde você insere a palavra que acredita ser a palavra secreta.

- **Botões**:
  - **Enviar Palpite**: Clique neste botão após digitar seu palpite para submetê-lo. O jogo irá comparar seu palpite com a palavra secreta e fornecerá um feedback.
  - **Desistir**: Se você estiver preso ou quiser saber a resposta, clique em "Desistir". Isso revelará a palavra secreta e limpará todas as tentativas anteriores, permitindo que você comece uma nova rodada.

#### 3. **Como Jogar**

- **Fazendo um Palpite**:
  1. Digite uma palavra no campo de palpite.
  2. Clique no botão "Enviar Palpite".
  3. O jogo avaliará seu palpite e mostrará uma mensagem indicando se você acertou ou errou. Se você errar, o jogo também exibirá uma pontuação de similaridade na escala de 0 a 10, indicando o quão próximo você está da palavra secreta.

- **Interpretando a Pontuação de Similaridade**:
  - **0-3**: Seu palpite está muito distante da palavra secreta.
  - **4-6**: Você está começando a se aproximar, mas ainda está um pouco distante.
  - **7-9**: Seu palpite está muito próximo da palavra secreta.
  - **10**: Você acertou a ordem e o conteúdo da palavra secreta com perfeição.

- **Desistindo**:
  - Se você clicar em "Desistir", o jogo revelará a palavra secreta e limpará a lista de palpites. Isso encerra a rodada atual e permite que você comece um novo jogo.

#### 4. **Histórico de Palpites**

- Abaixo do campo de entrada, você verá uma lista de todos os palpites anteriores que você fez, juntamente com a pontuação de similaridade de cada um. Isso ajuda a acompanhar seu progresso e a refinar suas próximas tentativas.

#### 5. **Mensagens de Erro**

- Se ocorrer algum problema ao buscar ou verificar uma palavra, uma mensagem de erro será exibida. Neste caso, tente recarregar a página ou verificar sua conexão com a internet.

#### 6. **Finalizando o Jogo**

- O jogo termina quando você adivinha a palavra secreta corretamente ou decide desistir. Você pode jogar quantas vezes quiser, pois cada rodada começa automaticamente após a anterior.



