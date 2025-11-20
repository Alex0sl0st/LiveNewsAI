import { getShortText } from "../../utils/getShortText.js";
import { getRandomUuid } from "../../utils/getRandomId.js";

export function createExpandableBlock(
  fullContent,
  isHtml = false,
  shortContent = ""
) {
  const contentId = `expand-${getRandomUuid()}`;
  const encodedFull = encodeURIComponent(fullContent);

  const displayShort = isHtml
    ? shortContent
    : shortContent || getShortText(fullContent);

  const encodedShort = encodeURIComponent(displayShort);

  return `
    <button 
      class="expandBtn" 
      data-expand-target="${contentId}" 
      data-expand-full="${encodedFull}"
      data-expand-short="${encodedShort}"
    >▼</button><br>

    <span id="${contentId}" class="expand-content">
      ${displayShort}
    </span>
  `;
}

export function attachExpandHandlers(root) {
  const buttons = root.querySelectorAll(".expandBtn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.expandTarget;

      const fullContent = decodeURIComponent(btn.dataset.expandFull);
      const shortContent = decodeURIComponent(btn.dataset.expandShort);

      const contentEl = root.querySelector(`#${targetId}`);
      const shouldExpand = btn.textContent === "▼";

      if (shouldExpand) {
        // EXPAND
        contentEl.innerHTML = fullContent;
        btn.textContent = "▲";
      } else {
        // COLLAPSE
        contentEl.innerHTML = shortContent;
        btn.textContent = "▼";
      }
    });
  });
}
