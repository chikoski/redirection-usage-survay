function addSheetRequest(sheet, index) {
  return {
    addSheet: {
      properties: {
        sheetId: sheet.id,
        title: sheet.title,
        index: index
      }
    }
  }
}

class Request {
  constructor(spreadsheet) {
    this.target = spreadsheet;
    this.product = {
      spreadsheetId: this.target.spreadsheetId,
      requests: []
    }
  }

  add(req) {
    this.product.requests.push(req);
    return this;
  }

  updateProperty() {
    const d = this.target.diff();
    const keys = Object.keys(d);
    if (keys.length == 0) {
      return this;
    }
    const req = {
      updateSpreadsheetProperties: {
        properties: d,
        fields: Object.keys(d).join(",")
      }
    }
    return this.add(req);
  }

  addSheet() {
    this.target
      .sheets.filter(sheet => sheet.isCreated)
      .map((sheet, index) => addSheetRequest(sheet, index))
      .forEach(req => this.add(req));
    return this;
  }

}

export { Request as default };
export { Request };