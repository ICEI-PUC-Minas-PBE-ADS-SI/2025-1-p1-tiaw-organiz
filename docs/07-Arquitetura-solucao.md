# Arquitetura da solução

<span style="color:red">Pré-requisitos: <a href="05-Projeto-interface.md"> Projeto de interface</a></span>

Esta seção descreve a estrutura da aplicação, incluindo os principais componentes e como eles interagem entre si, desde o navegador do usuário até o backend da aplicação.
  - Página Web com HTML, CSS e JavaScript.
  - Realiza requisições HTTP para o backend (JSON Server).

**Componentes da Solução**
- Navegador (Cliente):
  - Tela de cadastro e login de usuários.
  - Organização em pastas e metas.
  - Indicadores visuais de tarefas: concluídas, pendentes, atrasadas.
  - Calendário mensal para visualização de tarefas.
  - Criação e filtro de pastas.
  - Design responsivo.

- Servidor de Backend (JSON Server):
  - Responsável por fornecer os dados armazenados no arquivo db.json.
  - Permite persistência dos dados cadastrados no front-end.
  - Exposição de endpoints RESTful como:
      - GET /usuarios, POST /tarefas, PUT /pastas/:id, DELETE /metas/:id.

- Hospedagem:
  - Backend (JSON Server) hospedado no serviço OnRender, permitindo acesso online aos dados.
  - Frontend desenvolvido e testado localmente.

  



## Funcionalidades


##### Funcionalidade 1 - Cadastro de usuário

Permite a inclusão de novos usuários.

* **Estrutura de dados:** [Usuários](#estrutura-de-dados---usuários)
* **Instruções de acesso:**
  * Acesse o site e vá até a página de login;
  * Se ainda não possuir conta, clique em "Cadastrar-se";
  * Preencha os dados obrigatórios no formulário de cadastro de usuário;
  * Após o cadastro, o usuário deve realizar o login manualmente.
    
* **Tela da funcionalidade**:

![image](https://github.com/user-attachments/assets/688d11ba-c126-4b82-a2cc-aea45e7c828c)


##### Funcionalidade 2 - Criação de tarefas

Permite que o usuário crie novas tarefas, vinculando-as a uma pasta ou data específica.

* **Estrutura de dados:** [Tarefas](#estrutura-de-dados---Tarefas)
* **Instruções de acesso:**
  * Faça login no sistema;
  * Na tela inicial, Clique no botão “Criar Tarefa” ou ícone de "+";
  * Preencha os campos obrigatórios;
  * Clique em “Criar tarefa” para registrar a tarefa.
    
* **Tela da funcionalidade**:

![image](https://github.com/user-attachments/assets/e2e50bfa-54f5-4e82-a9f7-7d3c1cf7e6f4)


##### Funcionalidade 3 - Criação de pastas

Permite ao usuário criar novas pastas para organizar suas tarefas de forma personalizada. Cada pasta pode agrupar diversas tarefas relacionadas, facilitando a organização e a categorização.


* **Estrutura de dados:** [Pastas](#estrutura-de-dados---Pastas)
  
* **Instruções de acesso:**
  * Faça login no sistema;
  * Na tela inicial, Clique no botão “Criar Pasta”;
  * Preencha os campos obrigatórios;
  * Clique em “Criar pasta” para registrar a nova pasta;
  * A pasta aparecerá na listagem e poderá ser usada para agrupar tarefas, escrever no diário, nota rápida e adição de imagem.
    
* **Tela da funcionalidade**:

![image](https://github.com/user-attachments/assets/7a462e83-d1e3-4fd1-b090-11e1e9885a9c)


##### Funcionalidade 4 - Planejamento de metas

Permite ao usuário criar e gerenciar metas relacionadas às suas tarefas, ajudando no acompanhamento de objetivos e organização pessoal.


* **Estrutura de dados:** [Metas](#estrutura-de-dados---Metas)
  
* **Instruções de acesso:**
  * Faça login no sistema;
  * No menu lateral esquerdo, clique no botão “Metas”;
  * A interface irá exibir a lista de metas existentes e um botão para “Adicionar Meta”;
  * Ao clicar em “Adicionar Meta”, preencha os dados obrigatórios;
  * A pasta aparecerá na listagem e poderá ser usada para agrupar tarefas, escrever no diário, nota rápida e adição de imagem.
  * Clique em “Salvar Meta” para concluir;
  * As metas criadas poderão ser consultadas, editadas ou excluídas a qualquer momento.
    
* **Tela da funcionalidade**:

![image](https://github.com/user-attachments/assets/d2c4bdfc-ac0b-483f-b286-cbe4bc0cdbff)


##### Funcionalidade 5 - Calendário interativo

Exibe um calendário com as tarefas cadastradas em suas respectivas datas. O usuário pode visualizar rapidamente os compromissos e prazos organizados de forma visual e interativa.


* **Estrutura de dados:** [Metas](#estrutura-de-dados---Metas)
  
* **Instruções de acesso:**
  * Faça login no sistema;
  * Vá até a tela inicial;
  * O calendário é exibido na parte inferior da tela;
  * Se existir alguma tarefa cadastrada, o calendário mostrará o nome da tarefa e o nível de prioridade dela.

    
* **Tela da funcionalidade**:
  
![image](https://github.com/user-attachments/assets/c5f3df0a-9742-4253-9a81-8e66da2aeea1)


##### Funcionalidade 6 - Lista de tarefas

Exibe todas as tarefas cadastradas pelo usuário, organizadas por status (pendentes ou concluídas), com indicadores visuais de prioridade e data. Também permite concluir ou excluir tarefas diretamente na interface.


* **Estrutura de dados:** [Tarefas](#estrutura-de-dados---Tarefas)
  
* **Instruções de acesso:**
  * Faça login no sistema;
  * Vá até a tela inicial;
  * A seção "Lista de Tarefas" será exibida ao lado direito da tela;
  * As tarefas são divididas em pendentes e concluídas;
  * O usuário pode marcar/desmarcar tarefas como concluídas, excluir uma tarefa clicando no ícone da lixeira e Visualizar o título, descrição, data e prioridade de cada item.
    
* **Tela da funcionalidade**:
  
![image](https://github.com/user-attachments/assets/0ca278c9-a824-49fb-a1a7-35c94c68d4bd)


##### Funcionalidade 7 - Indicadores de status

Essa funcionalidade exibe três cards de resumo no topo da aplicação, com contadores visuais que indicam a quantidade de tarefas:


* **Estrutura de dados:** [Tarefas](#estrutura-de-dados---Tarefas)
  
* **Instruções de acesso:**
  * Faça login no sistema;
  * Vá até a tela inicial;
  * Os indicadores são exibidos automaticamente no topo da tela inicial.;
  * Adicione ou modifique tarefas para que os contadores sejam atualizados em tempo real.
    
* **Tela da funcionalidade**:
  
![image](https://github.com/user-attachments/assets/c93f4571-ca2c-4bb7-9795-72446c15b51c)


##### Funcionalidade 8 - Edição de perfil

Essa funcionalidade permite que o usuário visualize e edite seus dados pessoais e também atualize a senha diretamente pela interface da aplicação.


* **Estrutura de dados:** [Usuários](#estrutura-de-dados---Usuários)
  
* **Instruções de acesso:**
  * Faça login no sistema;
  * Acesse o ícone de perfil;
  * Clique na opção “Editar Perfil”;
  * Altere os campos desejados;
  * Clique em "Salvar Alterações" para confirmar as mudanças;
  * Clique em "Cancelar" se desejar descartar as modificações.
    
* **Tela da funcionalidade**:
  
![image](https://github.com/user-attachments/assets/8c226532-06fd-4dc1-a3d4-4edafe656eec)


##### Funcionalidade 9 - Barra de pesquisa de pastas

Essa funcionalidade permite que o usuário localize rapidamente pastas específicas por meio da barra de pesquisa, digitando palavras-chave relacionadas ao nome ou descrição da pasta.


* **Estrutura de dados:** [Pastas](#estrutura-de-dados---Pastas)
  
* **Instruções de acesso:**
  * Faça login no sistema;
  * Acesse a tela inicial do sistema;
  * Localize a seção "Pesquisar Pastas" no menu lateral esquerdo;
  * Digite um termo no campo de busca (por exemplo: trabalho);
  * Os resultados relacionados aparecerão automaticamente abaixo do campo;
  * Clique na pasta desejada para acessá-la diretamente.
    
* **Tela da funcionalidade**:
  
![image](https://github.com/user-attachments/assets/a46b004b-2120-44f6-867a-a1245082b8d5)


##### Funcionalidade 10 - Diário

Essa funcionalidade permite que o usuário registre reflexões, ideias, sentimentos ou acontecimentos do dia a dia por meio da criação de pastas.

* **Estrutura de dados:** [Diário](#estrutura-de-dados---Diário)
  
* **Instruções de acesso:**
  * Faça login no sistema;
  * Acesse uma pasta (ex: "Trabalho");
  * Clique no botão “Escrever no Diário”;
  * Um modal será aberto com o formulário para preenchimento;
  * Preencha os campos;
  * Clique em “Salvar Entrada” para registrar;
  * Clique em “Cancelar” para descartar.

    
* **Tela da funcionalidade**:

![image](https://github.com/user-attachments/assets/74773632-41e0-4148-8059-46769b99286a)


### Estruturas de dados

Descrição das estruturas de dados utilizadas na solução com exemplos no formato JSON.Info.

##### Estrutura de dados - Tarefas

Registro das tarefas criadas pelo usuário, associadas a uma pasta. Cada tarefa pode ter título, prioridade, status e data de vencimento, e serve como base para os indicadores de status exibidos na tela inicial.

```json
  {
  "id": "tarefa-001",
  "titulo": "Reunião de projeto",
  "descricao": "Reunião para discutir andamento das demandas",
  "dataVencimento": "2025-07-09",
  "prioridade": "Alta",                
  "status": "Pendente",             
  "pastaId": "1a2b3c4d",              
  "createdAt": "2025-01-26T21:30:00.000Z",
  "usuarioId": "eed55b91-45be-4f2c-81bc-7686135593f9"
}
  
```

##### Estrutura de dados - Usuários  

Registro dos usuários do sistema, contendo informações de identificação, contato e dados de login. Essas informações são utilizadas para login, exibição de perfil e edição de dados pessoais.

```json
 {
  "id": "eed55b91-45be-4f2c-81bc-7686135593f9",
  "nomeCompleto": "Yuri Alberto",
  "email": "yuri1200@gmail.com",
  "telefone": "(11) 99999-9999",
  "dataNascimento": "2000-05-10",
  "login": "yuri1200",
  "senha": "senha123",
  "criadoEm": "2025-01-20T12:00:00.000Z"
}
```

##### Estrutura de dados - Pastas 

Representa pastas criadas pelo usuário para organizar suas tarefas.

```json
  {
    "id": "pasta-exemplo-1",
    "nome": "Trabalho",
    "cor": "#6c757d",
    "descricao": "Projeto trabalho",
    "notas": [],
    "imagens": [],
    "tarefas": [],
    "createdAt": "2025-06-27T22:27:03.515Z",
    "usuarioId": "eed55b91-45be-4f2c-81bc-7686135593f9"
  }
```

##### Estrutura de dados - Metas 

Representa metas criadas pelo usuário, geralmente com um objetivo a ser atingido até uma data limite. Cada meta possui categoria, descrição e ícone.

```json
  {
    "id": "meta-1",
    "categoria": "Organização",
    "descricao": "Usar o OrganiZ todos os dias para melhorar produtividade",
    "icone": "🎯",
    "concluida": false,
    "createdAt": "2025-01-26T21:30:00.000Z",
    "usuarioId": "eed55b91-45be-4f2c-81bc-7686135593f9"
 }
```

##### Estrutura de dados - Diário

Representa pastas criadas pelo usuário para organizar suas tarefas e entradas no diário.

```json
  {
    "id": "entrada-001",
    "titulo": "Reflexões do dia",
    "conteudo": "Hoje tive um dia bem produtivo. Consegui organizar todas as tarefas pendentes e me senti realizado.",
    "humor": "Motivado",
    "categoria": "Pessoal",
    "createdAt": "2025-06-29T21:00:00.000Z",
    "pastaId": "trabalho",
    "usuarioId": "eed55b91-45be-4f2c-81bc-7686135593f9"
  }
```


### Módulos e APIs

Esta seção apresenta os módulos e APIs utilizados na solução.

**Images**:

* Unsplash - [https://unsplash.com/](https://unsplash.com/) ⚠️ EXEMPLO ⚠️

**Fonts:**

* Icons Font Face - [https://fontawesome.com/](https://fontawesome.com/) ⚠️ EXEMPLO ⚠️

**Scripts:**

* jQuery - [http://www.jquery.com/](http://www.jquery.com/) ⚠️ EXEMPLO ⚠️
* Bootstrap 4 - [http://getbootstrap.com/](http://getbootstrap.com/) ⚠️ EXEMPLO ⚠️

> ⚠️ **APAGUE ESTA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente os módulos e APIs utilizados no desenvolvimento da solução. Inclua itens como: (1) frameworks, bibliotecas, módulos, etc. utilizados no desenvolvimento da solução; (2) APIs utilizadas para acesso a dados, serviços, etc.


## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foram realizados.

> **Links úteis**:
> - [Website com GitHub Pages](https://pages.github.com/)
> - [Programação colaborativa com Repl.it](https://repl.it/)
> - [Getting started with Heroku](https://devcenter.heroku.com/start)
> - [Publicando seu site no Heroku](http://pythonclub.com.br/publicando-seu-hello-world-no-heroku.html)
