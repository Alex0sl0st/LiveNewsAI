class AdminActions {
  constructor() {
    this.getAll = document.querySelector("#getAll");
    this.createNewsAPI = document.querySelector("#createNewsAPI");
    this.sourceBBC = document.querySelector("#sourceBBC");

    this.deleteDuplicates = document.querySelector("#deleteDuplicates");
    this.deleteAllResetIds = document.querySelector("#deleteAllResetIds");

    this.getAction = (type, payload = {}) => ({
      type,
      payload,
    });
  }

  init(handleAction) {
    this.getAll.addEventListener("click", () =>
      handleAction(this.getAction("getAll"))
    );
    this.createNewsAPI.addEventListener("click", () =>
      handleAction(this.getAction("createNewsAPI"))
    );
    this.sourceBBC.addEventListener("click", () =>
      handleAction(this.getAction("sourceBBC"))
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
