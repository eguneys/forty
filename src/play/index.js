import aContainer from './acontainer';

import Forty from './forty';

export default function Play(ctx) {

  let dForty = new Forty(this, ctx);

  let container = this.container = new aContainer();
  const initContainer = () => {
    container.addChild(dForty);
  };
  initContainer();

  this.init = (data) => {
    dForty.init({});
  };

  this.update = delta => {
    this.container.update(delta);
  };

  this.render = () => {
    this.container.render();
  };
}
