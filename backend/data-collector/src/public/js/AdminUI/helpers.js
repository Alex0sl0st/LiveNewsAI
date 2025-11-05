import { getShortText } from "../../utils/getShortText.js";
import { getRandomUuid } from "../../utils/getRandomId.js";

export function createExpandTextBlock(fullText) {
  const shortText = getShortText(fullText);
  const contentId = `content-${getRandomUuid()}`;

  const expandBlock = `
  <button class="expandBtn" data-content-id="${contentId}" data-full-text="${fullText.replace(
    /"/g,
    "&quot;"
  )}">▼</button><br>
  <span id="${contentId}" class="contentText">${shortText}</span>`;

  return expandBlock;
}

export function attachExpandHandlers(block) {
  const expandButtons = block.querySelectorAll(".expandBtn");
  expandButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const contentId = button.getAttribute("data-content-id");
      const contentSpan = block.querySelector(`#${contentId}`);
      const fullText = button.getAttribute("data-full-text");

      if (button.textContent === "▼") {
        contentSpan.innerHTML = fullText;
        button.textContent = "▲"; //Collapse
      } else {
        const shortText = getShortText(fullText);
        contentSpan.innerHTML = shortText;
        button.textContent = "▼"; //Expand
      }
    });
  });
}
