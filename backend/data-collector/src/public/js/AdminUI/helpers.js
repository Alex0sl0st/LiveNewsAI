import { expandableContent } from "./ExpandableContent/ExpandableContent.js";

export function attachNewsActionHandlers(root, newsId, { onDelete }) {
  const actionsContainer = root.querySelector(".singleNewsActionsContainer");
  // const initialExpands = expandableContent.setAll(actionsContainer, true);

  const deleteBtn = actionsContainer.querySelector(".deleteNews");

  deleteBtn.addEventListener("click", () => {
    console.log(`${newsId} was deleted`);
    onDelete(newsId);
  });

  // expandableContent.restoreStates(initialExpands);
}

export function createButton(text, classes, onClick = null) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = classes;
  btn.addEventListener("click", onClick);

  return btn;
}
