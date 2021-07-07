import {
  querySelectorAllDeep,
  querySelectorDeep,
} from "query-selector-shadow-dom";

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomString() {
  return Math.random().toString(36).substring(7);
}

function randomNumber() {
  return Math.floor(Math.random() * 100).toString();
}

export const simulationActions = {
  "mb-quantity": {
    defined: (element) => {
      const input = querySelectorDeep("input", element);
      const select = querySelectorDeep("sl-select", element);
      const unit = querySelectorDeep("mb-unit", element);
      input.value = "31";
      if (select && unit) {
        select.value = unit.unit;
        select.dispatchEvent(new CustomEvent("sl-change"));
      }
      input.dispatchEvent(new Event("input"));
    },
    random: (element) => {
      const input = querySelectorDeep("input", element);
      const select = querySelectorDeep("sl-select", element);
      const unit = querySelectorAllDeep("mb-unit", element);
      if (select && unit.length > 0) {
        select.value = randomChoice(unit).unit;
        select.dispatchEvent(new CustomEvent("sl-change"));
      }
      input.value = randomNumber();
      input.dispatchEvent(new Event("input"));
    },
    undefined: async (element) => {
      const input = querySelectorDeep("input", element);
      const select = querySelectorDeep("sl-select", element);
      input.value = undefined;
      select.value = undefined;
      input.dispatchEvent(new Event("input"));
    },
  },
  "mb-select": {
    defined: (element) => {
      const select = querySelectorDeep("sl-select", element);
      const option = querySelectorDeep("mb-option", element);
      if (option) {
        select.value = option.value;
        select.dispatchEvent(new CustomEvent("sl-change"));
      }
    },
  },
  "mb-percent": {
    defined: (element) => {
      const input = querySelectorDeep("input", element);
      input.value = "31";
      input.dispatchEvent(new Event("input"));
    },
  },
  "mb-checkbox": {
    defined: (element) => {
      const checkbox = querySelectorDeep("sl-checkbox", element);
      checkbox.checked = true;
      checkbox.dispatchEvent(new CustomEvent("sl-change"));
    },
    undefined: async (element) => {
      element.data = undefined;
    },
  },
};
export function simulate(form) {
  const button = form.querySelector("#submit");
  const children: HTMLElement[] = Array.from(form.children);
  for (const node of children) {
    const type = node.tagName.toLowerCase();
    const states = simulationActions[type];
    if (states) {
      states["defined"](node);
      button.click();
    }
  }
}
