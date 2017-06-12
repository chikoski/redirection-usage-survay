import { DOM as dom, Component, createFactory } from "react";

class Icon extends Component {
  render() {
    return dom.i({ className: "material-icons" }, this.props.name)
  }
}

const renderIcon = createFactory(Icon);

export { Icon as default };
export { renderIcon, Icon };