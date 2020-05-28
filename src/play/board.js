import Pool from 'poolf';

import AContainer from './acontainer';

import One from './one';

import { swipeHandler } from './util';

import { allPos, key2pos, pos2key } from '../fortyutils';

export default function Forty(play, ctx, bs) {

  const { events } = ctx;

  let onePool = new Pool(() => new One(this, ctx, bs));

  let dOnes;

  let container = this.container = new AContainer();
  const initContainer = () => {
    
  };
  initContainer();

  let forty;

  this.init = board => {
    forty = board;

    onePool.each(_ => container.removeChild(_));
    onePool.releaseAll();

    for (let key in forty.data) {
      let pos = key2pos(key);
      let one = forty.data[key];

      let dOne = onePool.acquire(_ => _.init(one));

      dOne.container.move(pos[0] * bs.one.width,
                          pos[1] * bs.one.height);
      container.addChild(dOne);
    }
  };

  const handleSwipe = swipeHandler(swipe => {

    let { swiped, left, right, up, down } = swipe;
    
    if (!swiped) { 
      return;
    }

    const vss = {
      'left': [-1, 0],
      'right': [1, 0],
      'up': [0, -1],
      'down': [0, 1]
    };

    let vDir = left?vss['left']:(right?vss['right']:
                                 (up?vss['up']:vss['down']));

    forty.userSwipe(vDir);
  }, events);

  this.update = delta => {
    handleSwipe();
    this.container.update(delta);
  };

  this.render = () => {
    this.container.render();
  };
}
