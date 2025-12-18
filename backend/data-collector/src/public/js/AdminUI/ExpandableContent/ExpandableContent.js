import { getShortText } from "../../../utils/getShortText.js";
import { getRandomUuid } from "../../../utils/getRandomId.js";

class ExpandableContent {
  create({
    fullContent,
    isCollapse = true,
    isHtml = false,
    shortContent = "",
  }) {
    const contentId = `expand-${getRandomUuid()}`;
    const encodedFull = encodeURIComponent(fullContent);

    const displayShort = isHtml
      ? shortContent
      : shortContent || getShortText(fullContent);

    const encodedShort = encodeURIComponent(displayShort);

    return `
    <div class="expand-block" id="${contentId}">
      <button 
        class="expandBtn"  
        data-expand-full="${encodedFull}"
        data-expand-short="${encodedShort}"
      >${isCollapse ? "▼" : "▲"}</button>
      <div class="expand-content">
        ${isCollapse ? displayShort : fullContent}
      </div>
      </div>
    `;
  }

  setExpand(expandId, expand = false) {
    const expandBlock = document.querySelector(`#${expandId}`);

    const btn = this.getExpandButton(expandBlock);
    const contentEl = expandBlock.querySelector(`.expand-content`);

    const fullContent = decodeURIComponent(btn.dataset.expandFull);
    const shortContent = decodeURIComponent(btn.dataset.expandShort);

    if (expand) {
      // EXPAND
      contentEl.innerHTML = fullContent;
      btn.textContent = "▲";
    } else {
      // COLLAPSE
      contentEl.innerHTML = shortContent;
      btn.textContent = "▼";
    }
  }

  toggle(expandId) {
    const expandBlock = document.querySelector(`#${expandId}`);
    const btn = this.getExpandButton(expandBlock);

    const shouldExpand = btn.textContent === "▼";

    this.setExpand(expandId, shouldExpand);
  }

  attachHandlers(root) {
    const expandBlocks = root.querySelectorAll(".expand-block");

    expandBlocks.forEach((block) => {
      const btn = this.getExpandButton(block);

      btn.addEventListener("click", () => {
        this.toggle(block.id);
      });
    });
  }

  setAll(root, expand = true) {
    const expandBlocks = Array.from(root.querySelectorAll(".expand-block"));
    const initialExpands = expandBlocks.map((block) => {
      const btn = this.getExpandButton(block);
      const btnExpand = btn.textContent;

      this.setExpand(block.id, expand);
      return [block.id, btnExpand === "▲"];
    });

    return initialExpands;
  }

  restoreStates(initialExpands) {
    initialExpands.forEach(([id, shouldExpand]) => {
      this.setExpand(id, shouldExpand);
    });
  }

  getExpandButton(expandBlock) {
    return expandBlock.querySelector(`.expandBtn`);
  }
}

const expandableContent = new ExpandableContent();

export { expandableContent };
