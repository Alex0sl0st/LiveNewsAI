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
    console.log(news.images);

    news.images.forEach((image) => {
      html += `<h4 class="imageCaption">${image.caption}</h4>`;
      html += `<img class="newsImage" src="${image.url}" alt="${image.caption}">`;
    });

    html += `<h3><strong>Title:</strong> ${news.title}</h3>`;

    for (const key in news) {
      if (key !== "title") {
        let value = news[key];
        value =
          typeof value === "object"
            ? `<span class="imagesData">${JSON.stringify(value)}</span>`
            : value;
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
