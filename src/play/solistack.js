import { dContainer } from '../asprite';

import CandyDeck from './candydeck';
import CandyStack from './candystack';

import { fxHandler, fxHandler2 } from './util';

export default function Solistack(play, ctx, bs) {

  let solitaire;
  let stack;


  let dBacks = new CandyDeck(this, ctx, {
    extendLimit: true,
    deckHeight: bs.deck.height,
    ...bs
  });
  let dFronts = new CandyStack(this, ctx, {
    onBeginCard: (nCard, epos, decay) => {
      solitaire.select(stack.n, nCard, epos, decay);
    },
    onEndCard: (nCard) => {
      solitaire.endSelect(stack.n);
    },
    ...bs
  });

  let components = [];
  const container = dContainer();
  const initContainer = () => {

    dBacks.add(container);
    components.push(dBacks);

    dFronts.add(container);
    components.push(dFronts);

  };
  initContainer();

  this.init = data => {
    solitaire = data.solitaire;
    stack = solitaire.stack(data.i);

    dBacks.init({ nbStack: stack.hidden.length });
    dFronts.init({ stack: stack.front });
  };

  this.globalPositionNextCard = dFronts.globalPositionNextCard;
  this.globalPositionLastCard = dBacks.globalPositionLastCard;

  const handleSelected = fxHandler2({
    onBegin({ stackN }) {
      if (stackN === stack.n) {
        dFronts.init({ stack: solitaire.stack(stackN).front });
      }
    },
    onUpdate() {
    },
    onEnd({ stackN, dstStackN }) {
    }
  }, () => solitaire.data.selected);

  const handleSettled = fxHandler2({
    onBegin() {
    },
    onUpdate() {
    },
    onEnd({selected}) {

      let { dstStackN } = selected;

      if (dstStackN === stack.n) {
        dFronts.init({ stack: solitaire.stack(dstStackN).front });
      }
    }
  }, () => solitaire.data.settle);

  this.refresh = () => {
    dFronts.init({ stack: stack.front });
    dBacks.init({ nbStack: stack.hidden.length });
  };

  this.update = delta => {
    handleSelected(delta);
    handleSettled(delta);
    components.forEach(_ => _.update(delta));
  };

  const renderFront = () => {
    let lb = dBacks.nextBounds();
    dFronts.move(lb[0], lb[1]);
  };

  this.render = () => {
    components.forEach(_ => _.render());
    renderFront();
  };

  this.add = (parent) => {
    parent.addChild(container);
  };

  this.remove = () => {
    container.parent.removeChild(container);
  };

  this.bounds = () => container.getBounds();

  this.globalPosition = () => container.getGlobalPosition();

  this.move = (x, y) => container.position.set(x, y);
}