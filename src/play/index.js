import { dContainer, sprite } from '../asprite';
import Tapper from './tapper';

export default function Play(ctx) {

  const { textures, canvas } = ctx;

  let bs = (() => {
    let { width, height } = canvas;

    return {
      width,
      height
    };
  })();

  let container = dContainer();
  let tapper = new Tapper(this, ctx, bs);
  let components = [];

  const initContainer = () => {
    tapper.add(container);
    components.push(tapper);
  };
  initContainer();


  this.init = data => {
    
  };

  this.add = (parent) => {
    parent.addChild(container);
  };

  this.remove = () => {
    container.parent.removeChild(container);
  };

  this.update = delta => {
    components.forEach(_ => _.update(delta));
  };

  this.render = () => {
    components.forEach(_ => _.render());
  };

}
