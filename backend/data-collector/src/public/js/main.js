import { postNews } from "./api.js";
import { adminUI } from "./AdminUI/AdminUI.js";
import { adminActions } from "./AdminActions/AdminActions.js";

function handleAction(action) {
  postNews(action).then(({ data: gotNews, success, resType, massage }) => {
    adminUI.addLastMessage(massage);

    if (success && resType === "data") {
      adminUI.renderNews(gotNews);
    }
  });
}

adminActions.init(handleAction);

export default adminActions;
