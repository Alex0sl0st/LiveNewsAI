function getNews(req, res) {
  res.json(["New1", "New2", "New3"]);
}

function getNewsById(req, res) {
  const { id } = req.params;

  res.json({
    id,
    title: `News with id ${id}`,
  });
}

export { getNews, getNewsById };
