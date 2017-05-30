import { createFactory } from "react";
import ReactDOM from "react-dom";
import DashBoard from "./scenes/dashboard";
import Splash from "./components/splash";
import { DashBoard as DashBoardComponent } from "./components/dashboard";

const renderSplash = createFactory(Splash);
const renderDashboard = createFactory(DashBoardComponent);

class App {
  constructor({ api, container }) {
    this.api = api;
    this.container = container;
    this.scenes = {
      "dashboard": new DashBoard({ api: api, app: this, renderer: renderDashboard })
    };
  }
  get isSignedIn() {
    return this.api.isSignedIn;
  }
  set scene(name) {
    const nextScene = this.scenes[name];
    if (!nextScene) {
      return;
    }
    this.currentScene = nextScene;
    this.currentScene.start();
  }
  start() {
    if (this.signIn) {
      return this.signIn();
    } else {
      ReactDOM.render(renderSplash({ app: this }), this.container);
      return Promise.resolve(this);
    }
  }
  signIn() {
    this.api.signIn().then(api => this.list());
  }
  list() {
    this.scene = "dashboard";
  }
  update() {
    ReactDOM.render(this.currentScene.render(), this.container);
  }
}

export { App as default };
export { App };

