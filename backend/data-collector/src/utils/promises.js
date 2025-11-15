export function filterFulfilledPromises(promises) {
  const fulfilledPromises = promises
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => r.value);

  return fulfilledPromises;
}
