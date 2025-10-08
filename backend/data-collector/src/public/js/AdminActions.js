class AdminActions {
  constructor() {
    this.getAll = document.querySelector("#getAll");

    this.deleteDuplicates = document.querySelector("#deleteDuplicates");
    this.deleteAllResetIds = document.querySelector("#deleteAllResetIds");

    this.getAction = (type, payload = {}) => ({
      type,
      payload,
    });

    this.sourceButtons = {};
    document
      .querySelectorAll("#sourceButtonsContainer button[id]")
      .forEach((btn) => {
        this.sourceButtons[btn.id] = btn;
      });
  }

  init(handleAction) {
    Object.keys(this.sourceButtons).forEach((btnId) => {
      this.sourceButtons[btnId].addEventListener("click", () =>
        handleAction(this.getAction(btnId, { actionGenus: "source" }))
      );
    });

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
