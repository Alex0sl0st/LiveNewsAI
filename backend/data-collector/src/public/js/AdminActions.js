class AdminActions {
  constructor() {
    this.getAll = document.querySelector("#getAll");
    this.createNewsAPI = document.querySelector("#createNewsAPI");
    this.deleteDuplicates = document.querySelector("#deleteDuplicates");
    this.sourceBBC = document.querySelector("#sourceBBC");

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
    this.deleteDuplicates.addEventListener("click", () =>
      handleAction(this.getAction("deleteDuplicates"))
    );
    this.sourceBBC.addEventListener("click", () =>
      handleAction(this.getAction("sourceBBC"))
    );
  }
}

const adminActions = new AdminActions();

export { adminActions };
