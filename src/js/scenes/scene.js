class Scene {
  constructor({ api, app, renderer }) {
    this.api = api;
    this.app = app;
    this.renderer = renderer;
  }
  start() {
  }
  props(config = {}) {
    config[app] = config[app] ? config[app] : this.app;
    return config;
  }
}

export { Scene as default };
export { Scene };