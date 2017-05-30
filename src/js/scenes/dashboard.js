import Scene from "./scene";
import ShortUrl from "../models/short-url";

class DashBoard extends Scene {
  constructor(config) {
    super(config);
    this.histories = [];
    this.isExportable = false;
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
    Promise.all(this.histories.map(item => {
      return this.api
        .loadAnalytics(item)
        .then(res => this.app.update());
    })).then(response => {
      this.isExportable = true;
      this.app.update();
    });
  }
  export() {
    api.open("1sOJXByHWr7pczFwPqYEtLlaTN8tgGdHp9ncDiVnf9WY")
      .then(file => {
        const sheet = file.findOrAddSheet();
        sheet.addRow(["短縮URL", "リンク先", "表示回数"]);
        for (const history of this.histories) {
          sheet.addRow([history.id, history.longUrl, history.visits]);
        }
        return file.update();
      }).then(res => console.log(res));
  }
  render() {
    return this.renderer(this.props({
      histories: this.histories,
      scene: this,
      exportable: this.isExportable
    }))
  }
}

export { DashBoard as default };
export { DashBoard };