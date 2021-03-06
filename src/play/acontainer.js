import { dContainer } from '../asprite';

export default function aContainer() {
  
  let components = [],
      container = this.c = dContainer();
  
  this.addChild = (component) => {
    components.push(component);
    container.addChild(component.container.c);
  };

  this.removeChild = (component) => {
    components.splice(components.indexOf(component), 1);
    container.removeChild(component.container.c);
  };

  this.bounds = () => container.getBounds();

  this.move = (x, y) => {
    container.position.set(x, y);
  };

  this.update = (delta) => {
    this.each(_ => _.update(delta));
  };

  this.render = () => {
    this.each(_ => _.render());
  };

  this.each = (fn) => {
    components.forEach(fn);
  };

}
