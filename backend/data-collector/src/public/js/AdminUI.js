class AdminUI {
  constructor() {
    this.gotDataContainer = document.querySelector("#gotDataContainer");
    this.lastMessageContainer = document.querySelector("#lastMessageContainer");
  }

  addLastMessage(message = "", container = this.lastMessageContainer) {
    container.innerHTML = `<h2>Last Message:<br>${message}</h2>`;
  }

  getNewsInnerHTML(news, newsNumber = 1) {
    let html = "";

    html += `<h3>${newsNumber}</h3>`;

    news.images.forEach((image) => {
      html += `<h4 class="imageCaption">${image.caption}</h4>`;
      html += `<img class="newsImage" src="${image.url}" alt="${image.caption}">`;
    });

    html += `<h3><strong>Title:</strong> ${news.title}</h3>`;

    for (const key in news) {
      if (key !== "title") {
        let value = news[key];
        if (typeof value === "string") {
          value = value.replace(/\n\n/g, "<br><br>");
        } else if (typeof value === "object") {
          value = `<span class="imagesData">${JSON.stringify(value)}</span>`;
        }
        html += `<p ><b>${key}:</b> ${value}</p>`;
      }
    }

    return html;
  }

  renderNews(newsList, container = this.gotDataContainer) {
    container.innerHTML = "";
    newsList.forEach((news, index) => {
      const block = document.createElement("div");
      block.classList.add("singleNewsBlock");
      block.innerHTML = this.getNewsInnerHTML(news, newsList.length - index);
      container.appendChild(block);
    });
  }
}

const adminUI = new AdminUI();

export { AdminUI, adminUI };
