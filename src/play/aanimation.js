import { asprite } from '../asprite';
import AContainer from './acontainer';

export default function Play(play, ctx, bs) {

  let { x, y, width, height } = bs;
  let { textures = [], duration, loop } = bs;

  let dBody = asprite(textures, duration, loop);


  const setPosition = () => {
    dBody.position.set(x, y);
  };

  const setSize = () => {
    dBody.width = width;
    dBody.height = height;
  };

  let container = this.container = new AContainer();
  const initContainer = () => {
    container.c.addChild(dBody);
    setSize();
  };
  initContainer();

  this.init = (data) => {
    
  };

  this.scale = (x, y) => {
    container.c.scale.set(x, y);
  };

  this.size = (w, h) => {
    if (width === w || height === h) {
      return;
    }

    width = w;
    height = h;
    setSize();
  };

  this.move = (_x, _y) => {
    if (x === _x || y === _y) {
      return;
    }

    x = _x;
    y = _y;
    setPosition();
  };

  this.animation = (textures) => {
    dBody.textures(textures);
  };

  this.update = delta => {
    this.container.update(delta);
    dBody.update(delta);
  };

  this.render = () => {
    this.container.render();
  };
}
