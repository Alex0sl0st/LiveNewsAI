import { postNews } from "./api.js";
import { adminUI } from "./AdminUI/AdminUI.js";
import { adminActions } from "./AdminActions/AdminActions.js";

function handleAction(action) {
  postNews(action).then(
    ({ data, success, resType, massage, toDisplayOnPanel }) => {
      adminUI.addLastMessage(massage);

      if (!success) return;

      if (toDisplayOnPanel) {
        console.log(data);
        adminUI.renderPanelContent(data);
      } else if (resType === "data") {
        adminUI.renderNews(data);
      }
    }
  );
}

adminActions.init(handleAction);

export default adminActions;
