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



### Estruturas de dados

Descrição das estruturas de dados utilizadas na solução com exemplos no formato JSON.Info.

##### Estrutura de dados - Contatos

Contatos da aplicação

```json
  {
    "id": 1,
    "nome": "Leanne Graham",
    "cidade": "Belo Horizonte",
    "categoria": "amigos",
    "email": "Sincere@april.biz",
    "telefone": "1-770-736-8031",
    "website": "hildegard.org"
  }
  
```

##### Estrutura de dados - Usuários  ⚠️ EXEMPLO ⚠️

Registro dos usuários do sistema utilizados para login e para o perfil do sistema.

```json
  {
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    email: "admin@abc.com",
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    login: "admin",
    nome: "Administrador do Sistema",
    senha: "123"
  }
```

> ⚠️ **APAGUE ESTA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente as estruturas de dados utilizadas na solução tanto para dados utilizados na essência da aplicação, quanto outras estruturas que foram criadas para algum tipo de configuração.
>
> Nomeie a estrutura, coloque uma descrição sucinta e apresente um exemplo em formato JSON.
>
> **Orientações:**
>
> * [JSON Introduction](https://www.w3schools.com/js/js_json_intro.asp)
> * [Trabalhando com JSON - Aprendendo desenvolvimento web | MDN](https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/Objects/JSON)

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
