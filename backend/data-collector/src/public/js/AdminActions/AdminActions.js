import {
  getAllButtonsInContainer,
  initActionButtons,
  getValueFromInput,
  getSelectedItems,
  deselectAll,
} from "./helpers.js";
import { availableCategories } from "../constants/newsCategories.js";
import { newsSources } from "../constants/newsSources.js";

class AdminActions {
  constructor() {
    this.handleAction = () => console.log("AdminActions should be initiated");

    this.getAll = document.querySelector("#getAll");

    this.deleteDuplicates = document.querySelector("#deleteDuplicates");
    this.deleteAllResetIds = document.querySelector("#deleteAllResetIds");

    this.summarizeNews = document.querySelector("#summarizeNews");

    this.getAction = (type, payload = {}) => ({
      type,
      payload,
    });

    this.sourceButtons = getAllButtonsInContainer("sourceButtonsContainer");
    this.additionalToolsButtons = getAllButtonsInContainer("additionalTools");

    this.responsesPanel = document.getElementById("responsesPanel");
    this.toggleResponsesBtn = document.getElementById("toggleResponsesBtn");

    this.filterNewsBtn = document.getElementById("filterNewsBtn");
    this.clearFiltersBtn = document.getElementById("clearFiltersBtn");

    this.categoryFilter = document.getElementById("categoryFilter");
    this.categoriesListEl = document.getElementById("categoriesList");

    this.sourceFilter = document.getElementById("sourceFilter");
    this.sourcesListEl = document.getElementById("sourcesList");
  }

  deleteNews(ids, paginator = null) {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    this.handleAction(this.getAction("deleteNews", { ids }));

    if (paginator) {
      paginator.setItems(
        paginator.items.filter((item) => !idsArray.includes(item.id))
      );
    }
  }

  initMultiSelect(input, selectListEl, options = []) {
    options.forEach((cat) => {
      selectListEl.innerHTML += `
        <label class="multiSelectItem">
          <input type="checkbox" value="${cat}">
          <span>${cat}</span>
        </label>
      `;
    });

    input.addEventListener("click", () => {
      selectListEl.style.display =
        selectListEl.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".multiSelectContainer")) {
        selectListEl.style.display = "none";
      }
    });
  }

  getNewsFilterValue() {
    const newsFilter = {
      date: { dateFrom: "", dateTo: "" },
      mainCategories: [],
      sources: [],
    };

    newsFilter.date.dateFrom = getValueFromInput("dateFrom");
    newsFilter.date.dateTo = getValueFromInput("dateTo");

    newsFilter.mainCategories = getSelectedItems(this.categoriesListEl);

    newsFilter.sources = getSelectedItems(this.sourcesListEl);

    return newsFilter;
  }

  clearFilters() {
    document.getElementById("dateFrom").value = "";
    document.getElementById("dateTo").value = "";

    deselectAll(this.categoriesListEl);
    this.categoryFilter.textContent = "Select categories";
    this.categoriesListEl.style.display = "none";

    deselectAll(this.sourcesListEl);
    this.sourceFilter.textContent = "Select sources";
    this.sourcesListEl.style.display = "none";
  }

  init(handleAction) {
    this.handleAction = handleAction;

    initActionButtons(
      this.sourceButtons,
      "source",
      this.getAction,
      this.handleAction
    );
    initActionButtons(
      this.additionalToolsButtons,
      "extraTool",
      this.getAction,
      this.handleAction
    );

    this.getAll.addEventListener("click", () =>
      this.handleAction(this.getAction("getAll"))
    );

    this.deleteDuplicates.addEventListener("click", () =>
      this.handleAction(this.getAction("deleteDuplicates"))
    );
    this.deleteAllResetIds.addEventListener("click", () =>
      this.handleAction(this.getAction("deleteAllResetIds"))
    );

    this.summarizeNews.addEventListener("click", () =>
      this.handleAction(this.getAction("summarizeNews"))
    );

    this.filterNewsBtn.addEventListener("click", () =>
      this.handleAction(
        this.getAction("getFiltered", this.getNewsFilterValue())
      )
    );

    this.clearFiltersBtn.addEventListener("click", () => {
      this.clearFilters();
    });

    this.toggleResponsesBtn.addEventListener("click", () => {
      this.responsesPanel.classList.toggle("collapsed");
      this.toggleResponsesBtn.textContent =
        this.responsesPanel.classList.contains("collapsed") ? "▼" : "▲";
    });

    this.initMultiSelect(this.categoryFilter, this.categoriesListEl, [
      ...Object.values(availableCategories),
      "noCategory",
      "unmappedCategory",
    ]);

    this.initMultiSelect(this.sourceFilter, this.sourcesListEl, [
      ...newsSources,
    ]);
  }
}

const adminActions = new AdminActions();

export { adminActions };
