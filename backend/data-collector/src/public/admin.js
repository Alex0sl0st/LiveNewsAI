import adminActions from "./js/main.js";

// const getAll = document.querySelector("#getAll");
// const createNewsAPI = document.querySelector("#createNewsAPI");
// const deleteDuplicates = document.querySelector("#deleteDuplicates");
// const sourceBBC = document.querySelector("#sourceBBC");

// const gotDataContainer = document.querySelector("#gotDataContainer");
// const lastMassageContainer = document.querySelector("#lastMassageContainer");
// addLastMassage();

// function addLastMassage(massage = "") {
//   lastMassageContainer.innerHTML = `<h2>Last Massage:<br>${massage}</h2>`;
// }

// function getNewsInnerHTML(news) {
//   let newsInnerHTML = "";

//   newsInnerHTML += `<h3><strong>Title:</strong> ${news.title}</h3>`;

//   for (const key in news) {
//     const value = news[key];

//     if (key !== "title") {
//       newsInnerHTML += `<p><b class="">${key}:</b> ${value}</p>`; // uppercase-text
//     }
//   }

//   // newsInnerHTML += "<hr>";

//   return newsInnerHTML;
// }

// function postNews(action) {
//   fetch("/admin/newsAction", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ action }),
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       const { data: gotNews, success, resType, massage } = data;

//       addLastMassage(massage);

//       if (success && resType == "news") {
//         gotDataContainer.innerHTML = "";

//         gotNews.forEach((news) => {
//           const singleNewsBlock = document.createElement("div");
//           singleNewsBlock.classList.add("singleNewsBlock");
//           singleNewsBlock.innerHTML = getNewsInnerHTML(news);

//           gotDataContainer.appendChild(singleNewsBlock); // prepend
//         });
//       }
//     });
// }

// getAll.addEventListener("click", () => {
//   postNews("getAll");
// });
// createNewsAPI.addEventListener("click", () => {
//   postNews("createNewsAPI");
// });
// deleteDuplicates.addEventListener("click", () => {
//   postNews("deleteDuplicates");
// });

// sourceBBC.addEventListener("click", () => {
//   postNews("sourceBBC");
// });
