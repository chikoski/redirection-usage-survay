import Scene from "./base";
import { API, DISCOVER_DOCS } from "../constants";

const loadScript = url => new Promise((resolve, reject) => {
  const el = document.createElement("script");
  el.src = url;
  el.addEventListener("load", e => {
    return resolve();
  }, { once: true });
  el.addEventListener("error", e => {
    return reject(e);
  }, { once: true });
  document.body.appendChild(el);
});

const initGAPIClient = () => {
  return new Promise((resolve, reject) => {
    gapi.load("client", {
      callback: () => resolve(),
      onerror: () => reject("load error"),
      timeout: 5000,
      ontimeout: () => reject("timeout")
    });
  });
}

const discover = doc => {
  console.log(doc);
  return new Promise((resolve, reject) => {
    gapi.client.load(doc).then(success => resolve(success), fail => reject(fail));
  });
}

class Start extends Scene {
  constructor(conf) {
    super(conf);
    this.eventQueue.subscribe("start", data => {
      this.view.show();
      this.loadAPI();
    });
  }
  loadAPI() {
    return loadScript(API)
      .then(initGAPIClient)
      .then(() => {
        console.log("discover");
        Promise.all(DISCOVER_DOCS.map(doc => discover(doc)))
      })
      .then(() => this.eventQueue.publish("ready"))
      .catch(error => this.eventQueue.publish("api-load-error", error))
  }
}

export { Start as default };
export { Start };