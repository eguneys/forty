import { dContainer } from '../asprite';

export default class Component {
  
  constructor(play, ctx, bs) {
    this.play = play;
    this.ctx = ctx;
    this.bs = bs;

    this.components = [];
    this.container = dContainer();

    this.initContainer();
  }

  initContainer() {
  }

  init(data) {
    this.data = data;
  }

  add(component) {
    this.container.addChild(component.container);
    this.components.push(component);
  };

  update(delta) {
    this.components.forEach(_ => _.update(delta));
  };

  render() {
    this.components.forEach(_ => _.render());
  };

}
