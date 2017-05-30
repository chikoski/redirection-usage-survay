import Scene from "./scene";
import ShortUrl from "../models/short-url";

class DashBoard extends Scene {
  constructor(config) {
    super(config);
    this.histories = [];
  }
  start(startToken = null) {
    this.api.list(startToken).then(response => {
      const result = response.result;
      const items = result.items.map(item => new ShortUrl(item));
      this.histories = this.histories.concat(items);
      if (this.histories.length < result.totalItems) {
        this.start(result.startToken);
      } else {
        this.app.update();
        this.loadAnalytics();
      }
    });
  }
  loadAnalytics() {
    for (const item of this.histories) {
      this.api
        .loadAnalytics(item)
        .then(res => this.app.update());
    }
  }
  export() {
    console.log("export histories as a spreadsheet");
    this.api.create().then(file => {
      console.log(file);
      console.log(file.spreadsheetUrl);
    })
  }
  render() {
    return this.renderer(this.props({
      histories: this.histories,
      scene: this
    }))
  }
}

export { DashBoard as default };
export { DashBoard };