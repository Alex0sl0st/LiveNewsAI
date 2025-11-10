export function renderPaginator({ pagination, paginationContainer }) {
  paginationContainer.innerHTML = "";

  if (!pagination || pagination.totalPages <= 1) return;

  const makeBtn = (label, onClick, disabled) => {
    const b = document.createElement("button");
    b.className = "pageBtn";
    b.textContent = label;
    if (disabled) b.disabled = true;
    b.addEventListener("click", onClick);
    return b;
  };

  paginationContainer.append(
    makeBtn("« First", () => pagination.goTo(1), pagination.currentPage === 1),
    makeBtn("‹ Prev", () => pagination.prev(), pagination.currentPage === 1)
  );

  const info = document.createElement("span");
  info.className = "pageInfo";
  info.textContent = `Page ${pagination.currentPage} of ${pagination.totalPages}`;
  paginationContainer.appendChild(info);

  paginationContainer.append(
    makeBtn(
      "Next ›",
      () => pagination.next(),
      pagination.currentPage === pagination.totalPages
    ),
    makeBtn(
      "Last »",
      () => pagination.goTo(pagination.totalPages),
      pagination.currentPage === pagination.totalPages
    )
  );
}
