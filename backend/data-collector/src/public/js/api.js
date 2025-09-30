export async function postNews(action = { type: "", payload: {} }) {
  return fetch("/admin/newsAction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  }).then((res) => res.json());
}
