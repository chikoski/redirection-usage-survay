import Request from "./request";
import Sheet from "./sheet";

class SpreadSheet {
  constructor(sheet, api) {
    this.original = sheet;
    this.api = api;
    this.resuests = [];
    this.properties = {};
    this.sheets =
      sheet.sheets.map(sheet => {
        const props = sheet.properties;
        return new Sheet(props.sheetId, props.title)
      });
  }
  get spreadsheetId() {
    return this.original.spreadsheetId;
  }
  get spreadsheetUrl() {
    return this.original.spreadsheetUrl;
  }
  get title() {
    return this.properties.title ||
      this.original.properties.title;
  }
  set title(newTitle) {
    this.properties.title = newTitle;
  }
  addSeet(title) {
    if (title == null) {
      const now = new Date();
      title = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    }
    const sheet = Sheet.create(this.sheets.length + 1, title);
    console.log(sheet);
    this.sheets.push(sheet);
    return sheet;
  }
  diff() {
    const d = {};
    for (const attr in this.properties) {
      if (this.original.properties[attr] != this.properties[attr]) {
        d[attr] = this.properties[attr];
      }
    }
    return d;
  }
  toRequest() {
    const req = new Request(this);
    return req
      .updateProperty()
      .addSheet()
      .product;
  }
  update() {
    return new Promise((resolve, reject) => {
      this.api
        .spreadsheet
        .batchUpdate(this.toRequest())
        .then(res => {
          this.afterUpdate();
          resolve(res);
        }, error => reject(error));
    });
  }
  afterUpdate() {
    for (sheet of this.sheets) {
      sheet.clearFlags();
    }
  }


  static create(response, api) {
    const sheet = response.result;
    return new SpreadSheet(sheet, api)
  }
}

export { SpreadSheet as default };
export { SpreadSheet };