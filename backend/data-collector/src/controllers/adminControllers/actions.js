import * as handlers from "./handlers.js";
import { normalizeKeys } from "../../utils/normalizeKeys.js";

export function doNewsAction(req, res) {
  const { type, payload } = req.body.action;

  const sourceHandlers = normalizeKeys({
    bbc: () => handlers.sourceBBC(res),
    dw: () => handlers.sourceDW(res),
    ap: () => handlers.sourceAP(res),
  });

  if (payload.actionGenus === "source") {
    const handler = sourceHandlers[type.toLowerCase()];
    handler ? handler() : handlers.unknown(res);
  } else if (payload.actionGenus === "extraTool") {
    if (type === "summarize") {
      handlers.summarize(res);
    }
  } else {
    if (type === "getAll") {
      handlers.getAll(res);
    } else if (type === "deleteDuplicates") {
      handlers.deleteDuplicates(res);
    } else if (type === "deleteAllResetIds") {
      handlers.deleteAllResetIds(res);
    } else if (type === "summarizeNews") {
      handlers.summarize(res, true);
    } else if (type === "getFiltered") {
      handlers.getFiltered(res, payload);
    } else if (type === "deleteNews") {
      handlers.deleteNews(res, payload.ids);
    } else {
      handlers.unknown(res);
    }
  }
}
