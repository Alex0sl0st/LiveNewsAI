class AdminUI {
  constructor() {
    this.gotDataContainer = document.querySelector("#gotDataContainer");
    this.lastMessageContainer = document.querySelector("#lastMessageContainer");
  }

  addLastMessage(message = "", container = this.lastMessageContainer) {
    container.innerHTML = `<h2>Last Message:<br>${message}</h2>`;
  }

  getNewsInnerHTML(news) {
    let html = `<h3><strong>Title:</strong> ${news.title}</h3>`;

    for (const key in news) {
      if (key !== "title") {
        html += `<p><b>${key}:</b> ${news[key]}</p>`;
      }
    }

    return html;
  }

  renderNews(newsList, container = this.gotDataContainer) {
    container.innerHTML = "";
    newsList.forEach((news) => {
      const block = document.createElement("div");
      block.classList.add("singleNewsBlock");
      block.innerHTML = this.getNewsInnerHTML(news);
      container.appendChild(block);
    });
  }
}

const adminUI = new AdminUI();

export { AdminUI, adminUI };
