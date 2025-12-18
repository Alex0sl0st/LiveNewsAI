import { attachNewsActionHandlers } from "./helpers.js";
import { expandableContent } from "./ExpandableContent/ExpandableContent.js";
import { safeFormatTextForHtml } from "../../utils/safeFormatText.js";
import { Pagination } from "./Pagination/Pagination.js";
import { renderPaginator } from "./Pagination/paginatorView.js";
import { getCategorySlug } from "../../utils/getCategorySlug.js";

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

    let imagesBlock = "";
    news.images.forEach((image) => {
      imagesBlock += `<h4 class="imageCaption">${image.caption}</h4>`;
      imagesBlock += `<img class="newsImage" src="${image.url}" alt="${image.caption}">`;
    });

    html += expandableContent.create({
      fullContent: imagesBlock,
      isHtml: true,
      shortContent: "Images...",
    });

    html += `<h3><strong>Title:</strong> ${news.title}</h3>`;

    const { title, ...newsInfo } = news;
    for (const key in newsInfo) {
      let value = news[key];

      if (key === "content") {
        value = value.replace(/\n\n/g, "<br><br>");
        value = expandableContent.create({ fullContent: value });
      } else if (key === "images") {
        value = `<span class="imagesData">${JSON.stringify(value)}</span>`;
        value = expandableContent.create({ fullContent: value, isHtml: true });
      } else if (key === "category_id") {
        value = `<span>${JSON.stringify(value)} --- ${getCategorySlug(
          value
        )}</span>`;
      } else if (key === "relevant_categories") {
        const relevantCategoriesSlug = value.map((id) => getCategorySlug(id));
        value = `<span>${JSON.stringify(value)} --- ${JSON.stringify(
          relevantCategoriesSlug
        )}</span>`;
      } else {
        if (typeof value === "string") {
          value = value.replace(/\n\n/g, "<br><br>");
        } else if (typeof value === "object") {
          value = `<span>${JSON.stringify(value)}</span>`;
        }
      }

      html += `<p ><b>${key}:</b> ${value}</p>`;
    }

    const actionsBlockHTML = `
    <div class="singleNewsActions">
      <button class="deleteNews" data-id="${news.id}">Delete</button>
    </div>
  `;
    html += `<div class="singleNewsActionsContainer">${expandableContent.create(
      {
        fullContent: actionsBlockHTML,
        isCollapse: false,
        isHtml: true,
        shortContent: "Actions",
      }
    )}</div>`;

    return html;
  }

  renderPanelContent(data, message) {
    let dataToRender = data;
    if (message === "summarize") {
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

      attachNewsActionHandlers(block, news.id, {
        onDelete: () => console.log(news.id),
      });

      expandableContent.attachHandlers(block);
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
