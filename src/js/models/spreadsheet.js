function clone(obj) {
  const ret = {};
  for (const attr in obj) {
    ret[attr] = obj[attr];
  }
  return ret;
}

function propertyUpdateRequest(diff) {
  return {
    updateSpreadsheetProperties: {
      properties: diff,
      fields: Object.keys(diff).join(",")
    }
  }
}

class SpreadSheet {
  constructor(sheet, api) {
    this.sheet = sheet;
    this.api = api;
    this.resuests = [];
    this.originalProperties = clone(sheet.properties);
  }
  get spreadsheetId() {
    return this.sheet.spreadsheetId;
  }
  get spreadsheetUrl() {
    return this.sheet.spreadsheetUrl;
  }
  get title() {
    return this.sheet.properties.title;
  }
  set title(newTitle) {
    this.sheet.properties.title = newTitle;
  }
  diff() {
    const d = {};
    for (const attr in this.originalProperties) {
      if (this.originalProperties[attr] != this.sheet.properties[attr]) {
        d[attr] = this.sheet.properties[attr];
      }
    }
    return d;
  }
  toRequest() {
    return {
      spreadsheetId: this.spreadsheetId,
      requests: [
        propertyUpdateRequest(this.diff())
      ]
    };
  }
  update() {
    return this.api
      .spreadsheet
      .batchUpdate(this.toRequest());
  }

  static create(response, api) {
    const sheet = response.result;
    return new SpreadSheet(sheet, api)
  }
}

export { SpreadSheet as default };
export { SpreadSheet };