const getAll = document.querySelector("#getAll");
const gotDataContainer = document.querySelector("#gotDataContainer");
const lastMassageContainer = document.querySelector("#lastMassageContainer");
addLastMassage();

function addLastMassage(massage = "") {
  lastMassageContainer.innerHTML = `<h2>Last Massage:${massage}</h2>`;
}

function getNewsInnerHTML(news) {
  let newsInnerHTML = "";

  newsInnerHTML += `<h3><strong>Title:</strong> ${news.title}</h3>`;

  for (const key in news) {
    const value = news[key];

    if (key !== "title") {
      newsInnerHTML += `<p><b class="">${key}:</b> ${value}</p>`; // uppercase-text
    }
  }

  // newsInnerHTML += "<hr>";

  return newsInnerHTML;
}

function getAllNews() {
  fetch("/admin/newsAction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getAll" }),
  })
    .then((res) => res.json())
    .then((data) => {
      const { data: gotNews, success, resType, massage } = data;

      addLastMassage(massage);

      if (success && resType == "news") {
        gotDataContainer.innerHTML = "";

        gotNews.forEach((news) => {
          const singleNewsBlock = document.createElement("div");
          singleNewsBlock.classList.add("singleNewsBlock");
          singleNewsBlock.innerHTML = getNewsInnerHTML(news);

          gotDataContainer.appendChild(singleNewsBlock); // prepend
        });
      }
    });
}

getAll.addEventListener("click", getAllNews);
