import { createExpandTextBlock, attachExpandHandlers } from "./helpers.js";
import { safeFormatTextForHtml } from "../../utils/safeFormatText.js";
import { Pagination } from "./Pagination/Pagination.js";
import { renderPaginator } from "./Pagination/paginatorView.js";

class AdminUI {
  constructor() {
    this.gotDataContainer = document.querySelector("#gotDataContainer");
    this.lastMessageContainer = document.querySelector("#lastMessageContainer");
    this.lastAnsweringTimeContainer = document.querySelector(
      "#lastAnsweringTimeContainer"
    );

    this.responsesContent = document.getElementById("responsesContent");

    this.newsPaginationContainer = document.getElementById(
      "newsPaginationContainer"
    );

    this.newsPagination = new Pagination({
      items: [],
      pageSize: 50,
      onChange: (state) => this.onPageChange(state),
      reverseItems: false,
    });
  }

  addLastMessage(message = "", container = this.lastMessageContainer) {
    container.innerHTML = `<h2>Last Message:<br>${message}</h2>`;
  }

  addLastAnsweringTime(
    answeringTime = 0,
    container = this.lastAnsweringTimeContainer
  ) {
    container.innerHTML = `<h2>Last Answering Time:<br>${answeringTime}</h2>`;
  }

  getNewsInnerHTML(news, newsNumber = 1) {
    let html = "";

    html += `<h3>${newsNumber}</h3>`;

    news.images.forEach((image) => {
      html += `<h4 class="imageCaption">${image.caption}</h4>`;
      html += `<img class="newsImage" src="${image.url}" alt="${image.caption}">`;
    });

    html += `<h3><strong>Title:</strong> ${news.title}</h3>`;

    const { title, ...newsInfo } = news;
    for (const key in newsInfo) {
      if (key === "content") {
        let value = news[key];
        value = value.replace(/\n\n/g, "<br><br>");

        html += `<p><b>${key}:</b>
        ${createExpandTextBlock(value)}
      </p>`;
      } else {
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

  renderPanelContent(data, massage) {
    let dataToRender = data;
    if (massage === "summarize") {
      dataToRender = data.reduce((acc, cur, index) => {
        acc += JSON.stringify(cur);
        acc += `\n\n${index} ---------------------------\n\n`;

        return acc;
      }, "");
    }

    const saveData = safeFormatTextForHtml(dataToRender);
    this.responsesContent.innerHTML = `<div>${saveData}</div>`;
  }

  displayNews(newsList) {
    this.newsPagination.setItems(newsList);
  }

  renderNews(
    newsList,
    container = this.gotDataContainer,
    currentPage = 1,
    pageSize = 1
  ) {
    container.innerHTML = "";
    newsList.forEach((news, index) => {
      const block = document.createElement("div");
      block.classList.add("singleNewsBlock");
      block.innerHTML = this.getNewsInnerHTML(
        news,
        index + 1 + (currentPage - 1) * pageSize
      );
      container.appendChild(block);

      attachExpandHandlers(block);
    });
  }

  onPageChange({ items, currentPage, pageSize }) {
    this.renderNews(items, this.gotDataContainer, currentPage, pageSize);

    renderPaginator({
      pagination: this.newsPagination,
      paginationContainer: this.newsPaginationContainer,
    });
  }
}

const adminUI = new AdminUI();

export { AdminUI, adminUI };
