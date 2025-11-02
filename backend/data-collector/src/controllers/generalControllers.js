export function startCollecting(req, res) {
  res.status(200).send("<h1>Started Successful</h1>");
}

export function endCollecting(req, res) {
  res.status(200).send("<h1>Ended Successful</h1>");
}
