function createAboutPage(userWindowWidth) {

    d3.select("svg").classed("hidden", true);

    var aboutdiv = d3.select("div.visualization")
      .append("div")
      .attr("class", "about-page");

    var about = aboutdiv.append("div")
      .attr("class", "about-content");

    var who = aboutdiv.append("div")
      .attr("class", "about-content");

    about.append("h2")
      .attr("class", "section-title")
      .text("Sobre o projeto");

    about.append("p")
      .attr("class", "about-text")
      .text("Cenário é um projeto de desenvolvimento visualizações de dados sobre o cinema no Brasil que se baseia na exploração de visualizações interativas, com abordagens de interação que criem novas maneiras de visualizar, ou mesmo formas alternativas de representação, buscando gerar uma navegação intuitiva e completa. No processo, também explorou-se a relação de trabalho entre programador e designer, duas áreas segmentadas no Brasil, mas que muitas vezes se encerram em apenas um profissional no mercado internacional.")

    about.append("p")
      .attr("class", "about-text bold")
      .text("Por que o cinema");

    about.append("p")
      .attr("class", "about-text")
      .text("O visível crescimento da produção cinematográfica no Brasil tem agregado valor ao um abundante histórico de obras com assinatura brasileira, inclusive algumas que, com imenso refinamento e inteligência cinematográfica, consagraram-se internacionalmente.")

    about.append("p")
      .attr("class", "about-text")
      .text("Além dessa curiosidade acerca da possibilidade de visualizar quantitativamente a produção nacional, é possível perceber outros padrões? Há, por exemplo, um distúrbio na linha constante de consumo de conteúdo estadunidense? Estaria o paladar cultural brasileiro se “desamericanizando” em comparação a filmes de outras nacionalidades? Estamos produzindo mais filmes? Assistindo mais? Exibindo mais?");

    about.append("p")
      .attr("class", "about-text")
      .text("A partir de tantas perguntas, surgiu interesse em como funcionaria a dinâmica do cinema nacional. Algumas questões foram levantadas a partir de consultas aos dados abertos do OCA (Observatório de Cinema da Ancine) - um braço da Ancine (Agência Nacional do Cinema) órgão do Governo Federal - responsável por estudos e captação de dados sobre o cinema brasileiro.");

    about.append("p")
      .attr("class", "about-text bold")
      .text("Objetivo");

    about.append("p")
      .attr("class", "about-text")
      .text("Com esse projeto, buscamos ilustrar quantitativamente a atividade do cinema, chamando a atenção para seu desenvolvimento, assim como para a expansão dos conteúdos e suas nacionalidades. Também faz parte de nosso objetivo o uso de visualizações com abordagem alternativa – seja em seu visual ou em sua interação.");

    about.append("p")
      .attr("class", "about-text")
      .text("Este projeto está em andamento e foi desenvolvido utilizando a biblioteca de JavaScript D3.");


    who.append("h2")
      .attr("class", "section-title")
      .text("Equipe de desenvolvimento");

    var team1 = who.append("div")
      .attr("class", "team-member");

    team1.append("img")
      .attr("src", "imgs/pedro.jpg")
      .attr("class", "photo");

    team1.append("h3")
      .attr("class", "member-name")
      .text("Pedro Reis");

    team1.append("p")
      .attr("class", "member-description")
      .text("Engenharia Eletrônica e de Computação - UFRJ");

    var team2 = who.append("div")
      .attr("class", "team-member");

    team2.append("img")
      .attr("src", "imgs/victoria.png")
      .attr("class", "photo");

    team2.append("h3")
      .attr("class", "member-name")
      .text("Victória Molgado");

    team2.append("p")
      .attr("class", "member-description")
      .text("Comunicação Visual Design - UFRJ");

    who.append("h2")
      .attr("class", "section-title second-title")
      .text("Orientadores")

    var team3 = who.append("div")
      .attr("class", "team-member");

    team3.append("img")
      .attr("src", "imgs/claudio.png")
      .attr("class", "photo");

    team3.append("h3")
      .attr("class", "member-name")
      .text("Claudio Esperança");

    team3.append("p")
      .attr("class", "member-description")
      .text("Laboratório de Computação Gráfica - UFRJ");

    var team4 = who.append("div")
      .attr("class", "team-member");

    team4.append("img")
      .attr("src", "imgs/doris.jpg")
      .attr("class", "photo");

    team4.append("h3")
      .attr("class", "member-name")
      .text("Doris Kosminsky");

    team4.append("p")
      .attr("class", "member-description")
      .text("Laboratório de Visualidade e Visualização - UFRJ");

}
