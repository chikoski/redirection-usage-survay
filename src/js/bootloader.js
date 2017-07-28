import App from "./app";
import localforage from "localforage";

function container(selector) {
  return new Promise((resolve, reject) => {
    window.addEventListener("DOMContentLoaded", e => {
      const el = document.querySelector(selector);
      if (el == null) {
        return reject(`No element matched to ${selector}`);
      }
      return resolve(el);
    }, { once: true });
  });
}

function loadSettings(attributes) {
  return Promise.all(attributes.map(attr => localforage.getItem(attr)))
    .then(values => {
      const table = {};
      for (let i = 0; i < values.length; i++) {
        table[attributes[i]] = values[i];
      }
      return Promise.resolve(table);
    });
}

const Bootloader = {
  boot: function ({ selector, attributes }) {
    Promise.all([
      container(selector),
      loadSettings(attributes)
    ]).then(([el, settings]) => {
      const app = new App({ el: el, settings: settings });
      window.app = app;
      app.start();
    });
  }
};

export { Bootloader as default };
export { Bootloader };