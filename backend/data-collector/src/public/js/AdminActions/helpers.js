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
