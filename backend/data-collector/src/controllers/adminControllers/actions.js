import * as handlers from "./handlers.js";
import { normalizeKeys } from "../../utils/normalizeKeys.js";

export function doNewsAction(req, res) {
  const { type, payload } = req.body.action;

  const sourceHandlers = normalizeKeys({
    bbc: () => handlers.sourceBBC(res),
    dw: () => handlers.sourceDW(res),
    createNewsAPI: () => handlers.createNewsAPI(res),
  });

  if (payload.actionGenus === "source") {
    const handler = sourceHandlers[type.toLowerCase()];
    handler ? handler() : handlers.unknown(res);
  } else {
    if (type === "getAll") {
      handlers.getAll(res);
    } else if (type === "deleteDuplicates") {
      handlers.deleteDuplicates(res);
    } else if (type === "deleteAllResetIds") {
      handlers.deleteAllResetIds(res);
    } else {
      handlers.unknown(res);
    }
  }
}
