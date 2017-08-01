import EventQueue from "./event-queue";
import { Scene as SceneView, Dialog } from "./component";
import { Start, DashBoard, Signin } from "./scenes";
import { SCOPES } from "./constants";

const toA = list => Array.prototype.concat.apply([], list);

const promise = f => new Promise((resolve, reject) => f());

const createComponentMap = (base, queue) =>
  (selector, klass) => toA(base.querySelectorAll(selector)).reduce((map, el) => {
    const component = new klass({ el: el, eventQueue: queue });
    map.set(component.id, component);
    return map;
  }, new Map());

const associate = (table, eventQueue) => Object.keys(table).reduce((map, selector) => {
  const klass = table[selector];
  const conf = { el: document.querySelector(`#${selector}`), eventQueue: eventQueue };
  const obj = new klass(conf);
  map.set(selector, obj);
  return map;
}, new Map());

class App {
  constructor({ el, settings = {} }) {
    this.el = el;
    this.settings = settings;
    this.googleUser = null;

    this.queue = new EventQueue([
      "scene-transition", "show-dialog", "start", "signout", "load-error", "ready", "signin"
    ]);

    const createMap = createComponentMap(this.el, this.queue);
    this.dialogs = createMap(".dialog", Dialog);
    this.scenes = associate({
      "start": Start,
      "signin": Signin,
      "dashboard": DashBoard
    }, this.queue);

    this.queue.subscribe("show-dialog", error => {
      let dialog = null;
      switch (error.type) {
        case "api-error":
          dialog = this.dialogs.get("api-load-error");
          break;
        case "load-error":
          dialog = this.dialogs.get("data-load-error");
        default:
      }
      if (dialog) {
        dialog.show();
      }
    });

    this.queue.subscribe("ready", data => {
      console.log("ready");
      return this.transite("signin")
        .then(app => console.log("signin"))
        .catch(error => console.error(error));
    });

    window.onSignIn = googleUser => this.signin(googleUser);
  }
  start() {
    this.transite("start").then(result => console.log("Transite to start scene"));
    this.queue.publish("start", {});
  }
  signin(googleUser) {
    this.googleUser = googleUser;
    const options = new gapi.auth2.SigninOptionsBuilder({
      scope: SCOPES.join(" ")
    });
    return this.googleUser.grant(options)
      .then(success => {
        this.queue.publish("signin");
      }, fail => {
        this.queue.publish("api-load-error", fail);
      }); // XXX
  }
  transite(newScene) {
    console.log(`transite to ${newScene}`);
    return promise(() => {
      if (this.scenes.has(newScene)) {
        console.log(`A scene object associated with ${newScene} is found`);
        this.scene = this.scenes.get(newScene);
        console.log(this.scene);
        this.queue.publish("scene-transition", this.scene);
        return Promise.resolve(this);
      }
      return Promise.reject(`No corresponding scene is available for ${newScene}`);
    });
  }
}

export { App as default };
export { App };