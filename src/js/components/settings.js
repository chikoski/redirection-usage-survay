import { DOM as dom, Component, createFactory } from "react";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.status = {
      spreadsheetUrl: props.spreadsheetUrl
    };
  }
  renderContorls() {
    return dom.div({},
      dom.button({
        className: "primary",
        onClick: e => {
          this.props.scene.app.setConfig({ spreadsheet: this.status.spreadsheetUrl });
          if (typeof this.props.onSubmit === "function") {
            this.props.onSubmit(e);
          }
        },
      }, "保存"),
      dom.button({
        onClick: e => this.props.onCancel ? this.props.onCancel(e) : null
      }, "キャンセル")
    );
  }
  render() {
    return dom.div({ className: "settings" },
      dom.div({},
        dom.h2({}, "記録するスプレッドシート"),
        dom.input({
          type: "text",
          placeholder: "Google スプレッドシートのURL",
          value: this.status.spreadsheetUrl,
          onChange: e => this.setStatus({ spreadsheetUrl: e.target.value }),
        })),
      this.renderContorls()
    );
  }
}

const renderSttings = createFactory(Settings);

export { Settings as default };
export { Settings, renderSttings };