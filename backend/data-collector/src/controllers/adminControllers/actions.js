import * as handlers from "./handlers.js";

export function doNewsAction(req, res) {
  const { type } = req.body.action;

  if (type === "getAll") {
    handlers.getAll(res);
  } else if (type === "createNewsAPI") {
    handlers.createNewsAPI(res);
  } else if (type === "deleteDuplicates") {
    handlers.deleteDuplicates(res);
  } else if (type === "sourceBBC") {
    handlers.sourceBBC(res);
  } else if (type === "deleteAllResetIds") {
    handlers.deleteAllResetIds(res);
  } else {
    handlers.unknown(res);
  }
}
