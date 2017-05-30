import Scene from "./scene";

class SignIn extends Scene {
  render() {
    return this.renderer({ app: this.app });
  }
}

export { SignIn as default };
export { SignIn };