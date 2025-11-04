function getAllButtonsInContainer(containerId) {
  const buttons = {};
  document.querySelectorAll(`#${containerId} button[id]`).forEach((btn) => {
    buttons[btn.id] = btn;
  });

  return buttons;
}

function initActionButtons(buttons, actionGenus, getAction, handleAction) {
  Object.keys(buttons).forEach((btnId) => {
    buttons[btnId].addEventListener("click", () =>
      handleAction(getAction(btnId, { actionGenus }))
    );
  });
}

class AdminActions {
  constructor() {
    this.getAll = document.querySelector("#getAll");

    this.deleteDuplicates = document.querySelector("#deleteDuplicates");
    this.deleteAllResetIds = document.querySelector("#deleteAllResetIds");

    this.getAction = (type, payload = {}) => ({
      type,
      payload,
    });

    this.sourceButtons = getAllButtonsInContainer("sourceButtonsContainer");
    this.additionalToolsButtons = getAllButtonsInContainer("additionalTools");
  }

  init(handleAction) {
    initActionButtons(
      this.sourceButtons,
      "source",
      this.getAction,
      handleAction
    );
    initActionButtons(
      this.additionalToolsButtons,
      "extraTools",
      this.getAction,
      handleAction
    );

    this.getAll.addEventListener("click", () =>
      handleAction(this.getAction("getAll"))
    );

    this.deleteDuplicates.addEventListener("click", () =>
      handleAction(this.getAction("deleteDuplicates"))
    );
    this.deleteAllResetIds.addEventListener("click", () =>
      handleAction(this.getAction("deleteAllResetIds"))
    );
  }
}

const adminActions = new AdminActions();

export { adminActions };
