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

function extendedValue(value) {
  if (Number.isFinite(value)) {
    return {
      "numberValue": value
    };
  } else {
    return {
      "stringValue": value
    }
  }
}

function rowData(row) {
  const values =
    row.values.map(value => {
      return {
        userEnteredValue: extendedValue(value)
      }
    });
  return {
    values: values
  }
}

function updateCellsRequest(sheet) {
  const rows =
    sheet.rows
      .filter(row => !row.isNotModified)
      .map(row => rowData(row));
  return {
    "updateCells": {
      start: {
        sheetId: sheet.id,
        rowIndex: 0,
        columnIndex: 0,
      },
      rows: rows,
      fields: "*"
    }
  };
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

  updateValues() {
    this.target
      .sheets.filter(sheet => sheet.isModified)
      .map(sheet => updateCellsRequest(sheet))
      .forEach(req => this.add(req));
    return this;
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