import { dContainer } from '../asprite';

import CandyCards from './candycards';
import { fxHandler, fxHandler2 } from './util';
import { backCard } from '../cards';
import * as v from '../vec2';

export default function SpiderDeal(play, ctx, bs) {

  let dCards = new CandyCards(this, ctx, bs);

  let settleSource,
      settleTargetDiff;

  let components = [];
  const container = dContainer();
  const initContainer = () => {

    dCards.add(container);
    components.push(dCards);

  };
  initContainer();

  let spider;

  this.init = data => {
    spider = data.spider;
  };

  const handleDeal = fxHandler({
    allowEnd: true,
    duration: 1000 / 30,
    onBegin(fxDataDeal) {
      let { cards,
            stackN,
            isHidden } = fxDataDeal.data;

      dCards.visible(true);

      if (isHidden) {
        dCards.init(backCard);
      } else {
        dCards.init(cards[0]);
      }

      settleSource = play.drawDeckGlobalPosition();
      let settleTarget = play.stackNextCardGlobalPosition(stackN);

      settleTargetDiff = [settleTarget[0] - settleSource.x,
                          settleTarget[1] - settleSource.y];
    },
    onUpdate(_, i) {
      let vSettleTarget = v.cscale(settleTargetDiff, i);
      dCards.move(settleSource.x + vSettleTarget[0],
                  settleSource.y + vSettleTarget[1]);      
    },
    onEnd() {
      dCards.visible(false);
    }
  }, () => spider.data.deal);

  this.update = delta => {
    handleDeal(delta);
    components.forEach(_ => _.update(delta));
  };

  this.render = () => {
    components.forEach(_ => _.render());
  };

  this.add = (parent) => {
    parent.addChild(container);
  };

  this.remove = () => {
    container.parent.removeChild(container);
  };

  this.move = (x, y) => container.position.set(x, y);
}
