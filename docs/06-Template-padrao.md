# Template padrão da aplicação

Header:
.header
{
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #8000FF;
}

.header h1
{
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 60px;
    padding-left: 30px;
    color: black;
    cursor: pointer;
}

A escolha da cor #8000FF (um tom de roxo) no header tem base na psicologia das cores. O roxo é conhecido por estimular a imaginação e a criatividade, criando uma sensação de inovação e originalidade logo na primeira visualização do site. Isso faz com que o usuário se sinta motivado e curioso para explorar o conteúdo. O texto em preto mantém o contraste e facilita a leitura.

Body:
html, body
{
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

No corpo da página, o foco é na simplicidade e na organização. O espaço limpo e sem margens desnecessárias ajuda o usuário a manter a atenção no conteúdo principal, sem distrações visuais. A escolha de um layout centralizado facilita a navegação e a busca por informações.

Footer:
footer
{
    background-color: black;
    color: white;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
}

O rodapé segue esse estilo menor e com cores menos chamativas para não tomar a atenção do usuário, mas sim apenas delimitar um fim para a página.
