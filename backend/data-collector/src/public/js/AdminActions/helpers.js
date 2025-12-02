export function getAllButtonsInContainer(containerId) {
  const buttons = {};
  document.querySelectorAll(`#${containerId} button[id]`).forEach((btn) => {
    buttons[btn.id] = btn;
  });
  return buttons;
}

export function initActionButtons(
  buttons,
  actionGenus,
  getAction,
  handleAction
) {
  Object.keys(buttons).forEach((btnId) => {
    buttons[btnId].addEventListener("click", () =>
      handleAction(getAction(btnId, { actionGenus }))
    );
  });
}

export function getValueFromInput(id) {
  return document.getElementById(id).value;
}

export function deselectAll(el) {
  const checkboxes = el.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((cb) => (cb.checked = false));
}

export function getSelectedItems(selectList) {
  const selected = Array.from(selectList.querySelectorAll("input:checked")).map(
    (i) => i.value
  );

  return selected;
}
