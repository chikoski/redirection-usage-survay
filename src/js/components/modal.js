import { DOM as dom, Component, createFactory } from "react";

function makeModal(Component) {
  const factory = createFactory(Component);
  class Modal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hidden: props.hidden || false
      }
    }
    get className() {
      const base = "modal";
      return this.hidden ? `${base} hidden` : base;
    }
    get hidden() {
      return this.state.hidden;
    }
    componentWillReceiveProps(nextProps) {
      if (nextProps.hidden != null) {
        this.setState({ hidden: nextProps.hidden });
      }
    }
    hide() {
      this.setState({ hidden: true });
    }
    show() {
      this.setState({ hidden: false });
    }
    render() {
      return dom.div({ className: this.className },
        dom.div({ className: "window" },
          factory(this.props),
          dom.button({ className: "close", onClick: e => this.hide() }, "x")
        )
      );
    }
  }
  return Modal;
}

export { makeModal as default };
export { makeModal };
