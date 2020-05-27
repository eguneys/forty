import { makeOneDeck } from './deck';

import Fx from './fxs';

import SpiderDealsFx from './spiderdealsfx';
import SpiderDrawDeck from './spiderdrawdeck';
import Undos from './undos';

export default function Spider() {

  let data = this.data = {
    drawStack: new SpiderDrawDeck(),
    stacks: [
      new SpiderStack(0),
      new SpiderStack(1),
      new SpiderStack(2),
      new SpiderStack(3),
      new SpiderStack(4),
      new SpiderStack(5),
      new SpiderStack(6),
      new SpiderStack(7),
      new SpiderStack(8),
      new SpiderStack(9)
    ]
  };

  let undos = this.undos = new Undos();

  let dealsFxer = new SpiderDealsFx(this);

  const onDealEnd = (fxDataEnd) => {
    fxDataEnd.doEnd();
  };

  let fxDeal = new Fx(data, 'deal', onDealEnd);

  const onFxDataEnd = (fxData) => {
    fxData.doEnd();
  };
  
  let fxUndoDeal = new Fx(data, 'undodeal', onFxDataEnd);

  let allFxs = [fxDeal, fxUndoDeal];

  this.stack = n => data.stacks[n];
  this.drawStack = data.drawStack;

  let deck1 = makeOneDeck(),
      deck2 = makeOneDeck();

  this.newGame = () => {
    if (busyFxs() || dealsFxer.busy()) {
      return;
    }

    this.init();
  };

  this.undo = () => {
    if (busyFxs() || dealsFxer.busy()) {
      return;
    }

    undos.undo();
  };

  this.init = () => {
    reset();
    beginDeal();
  };

  const reset = () => {
    fxDeal.cancel();

    data.stacks.forEach(_ => _.clear());

    undos.init();
  };

  const beginDeal = () => {
    deck1.shuffle();
    deck2.shuffle();

    data.drawStack.init([...deck1.drawRest(),
                         ...deck2.drawRest()]);

    dealsFxer.init();
  };

  const undoDeal = () => {

    dealsFxer.beginUndoDeal1();

  };

  this.beginDraw = () => {
    if (busyFxs() || dealsFxer.busy()) {
      return;
    }

    dealsFxer.beginDeal1();

    undos.push(undoDeal);
  };

  const busyFxs = () => {
    return allFxs.some(_ => _.value());
  };

  const updateFxs = (delta) => {
    allFxs.forEach(_ => _.update(delta));
  };


  const updateDeals = delta => {
    if (busyFxs()) {
      return;
    }

    let fxData = dealsFxer.acquireDeal();
    if (fxData) {
      fxDeal.begin(fxData);
    }

    fxData = dealsFxer.acquireDeal1();
    if (fxData) {
      fxDeal.begin(fxData);
    }

    fxData = dealsFxer.acquireUndoDeal1();
    if (fxData) {
      fxUndoDeal.begin(fxData);
    }

  };

  this.update = (delta) => {
    updateDeals(delta);
    updateFxs(delta);
  };
}


function SpiderStack(n, hidden = [], front = []) {
  
  this.n = n;
  this.front = front;
  this.hidden = hidden;

  this.cut1 = n => front.splice(n, front.length - n);

  this.hide1 = cards => {
    cards.forEach(_ => hidden.push(_));
  };

  this.add1 = cards => {
    cards.forEach(_ => front.push(_));
  };

  this.remove1 = () => {
    return front.pop();
  };

  this.clear = () => {
    front = this.front = [];
    hidden = this.hidden = [];
  };

  this.reveal1 = () => {
    return hidden.pop();
  };

  const top = () => front[front.length - 1];

  this.canReveal = () => front.length === 0 && hidden.length > 0;
}