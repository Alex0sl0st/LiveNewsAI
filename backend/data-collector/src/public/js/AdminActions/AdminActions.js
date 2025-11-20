import {
  getAllButtonsInContainer,
  initActionButtons,
  getValueFromInput,
} from "./helpers.js";

class AdminActions {
  constructor() {
    this.getAll = document.querySelector("#getAll");

    this.deleteDuplicates = document.querySelector("#deleteDuplicates");
    this.deleteAllResetIds = document.querySelector("#deleteAllResetIds");

    this.summarizeNews = document.querySelector("#summarizeNews");
    this.filterByDateBtn = document.querySelector("#filterByDateBtn");

    this.getAction = (type, payload = {}) => ({
      type,
      payload,
    });

    this.sourceButtons = getAllButtonsInContainer("sourceButtonsContainer");
    this.additionalToolsButtons = getAllButtonsInContainer("additionalTools");

    this.responsesPanel = document.getElementById("responsesPanel");
    this.toggleResponsesBtn = document.getElementById("toggleResponsesBtn");
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
      "extraTool",
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

    this.summarizeNews.addEventListener("click", () =>
      handleAction(this.getAction("summarizeNews"))
    );

    this.filterByDateBtn.addEventListener("click", () =>
      handleAction(
        this.getAction("filterByDate", {
          dateFrom: getValueFromInput("dateFrom"),
          dateTo: getValueFromInput("dateTo"),
        })
      )
    );

    this.toggleResponsesBtn.addEventListener("click", () => {
      this.responsesPanel.classList.toggle("collapsed");
      this.toggleResponsesBtn.textContent =
        this.responsesPanel.classList.contains("collapsed") ? "▼" : "▲";
    });
  }
}

const adminActions = new AdminActions();

export { adminActions };
