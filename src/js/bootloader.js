import App from "./app";
import API from "./api";

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
  start: function (api, container) {
    window.api = api;
    const app = new App({
      container: container,
      api: api
    });
    return app.start();
  },
}

const Bootloader = {
  boot: function (url, selector) {
    return Promise.all([Helper.api(url), Helper.container(selector)])
      .then(results => Helper.start(results[0], results[1]))
      .catch(error => console.log(error));
  }
};

export { Bootloader as default };
export { Bootloader };