import { rect } from '../dquad/geometry';
import AContainer from './acontainer';

import Forty from './board';

import FortyGame from '../forty';

import { rows, cols } from '../fortyutils';

export default function FortyGameView(play, ctx, pbs) {

  let bs = (() => {
    let { width, height } = ctx.canvas;

    let bMargin = width * 0.01;
    let sWidth = (width - bMargin * 2.0) / cols;
    let sMargin = sWidth * 0.1;

    let forty = rect(bMargin, bMargin, 0, 0);

    let score = rect(0, 0, sWidth, sWidth);

    let one = rect(0, 0, sWidth, sWidth);

    return {
      forty,
      one,
      score,
      bMargin,
      sMargin,
      width,
      height
    };
  })();

  let dForty = new Forty(this, ctx, bs);

  let container = this.container = new AContainer();
  const initContainer = () => {

    container.addChild(dForty);

  };
  initContainer();

  let fortyGame = new FortyGame();

  this.init = (data) => {

    fortyGame.init({});

    dForty.init(fortyGame.data.board);
    dForty.container.move(bs.forty.x, bs.forty.y);

  };

  this.update = delta => {
    fortyGame.update();
    this.container.update(delta);
  };

  this.render = () => {
    this.container.render();
  };
}
