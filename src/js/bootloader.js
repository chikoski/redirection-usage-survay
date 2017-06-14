import App from "./app";
import API from "./api";
import localforage from "localforage";

const Helper = {
  container: function (selector) {
    return new Promise((resolve, rejedct) => {
      window.addEventListener("DOMContentLoaded", e => {
        return resolve(document.querySelector(selector));
      }, { once: true });
    });
  },
  config: function (url) {
    return fetch(url).then(res => res.json());
  },
  api: function (configUrl) {
    return this.config(configUrl).then(conf => API.load(conf));
  },
  localSettings: function (attributes) {
    return Promise.all(attributes.map(attr => localforage.getItem(attr)))
      .then(values => {
        const table = {};
        for (let i = 0; i < values.length; i++) {
          table[attributes[i]] = values[i];
        }
        return Promise.resolve(table);
      })
  },
  start: function (api, container, preference) {
    window.api = api;
    const app = new App({
      container: container,
      api: api,
      preference: preference
    });
    return app.start();
  },
}

const Bootloader = {
  boot: function (url, selector, localSettings) {
    return Promise.all([Helper.api(url), Helper.container(selector), Helper.localSettings(localSettings)])
      .then(results => Helper.start(results[0], results[1], results[2]))
      .catch(error => console.log(error));
  }
};

export { Bootloader as default };
export { Bootloader };