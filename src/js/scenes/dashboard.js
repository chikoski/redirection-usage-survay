import Scene from "./scene";

class DashBoard extends Scene {
  constructor(config) {
    super(config);
    this.histories = [];
  }
  start(startToken = null) {
    this.api.list(startToken).then(response => {
      const result = response.result;
      const items = result.items;
      this.histories = this.histories.concat(result.items);
      if (this.histories.length < result.totalItems) {
        this.start(result.startToken);
      } else {
        this.app.update();
      }
    });
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