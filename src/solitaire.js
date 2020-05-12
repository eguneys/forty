import { makeOneDeck } from './deck';
import Fx from './fxs';

import * as solifx from './solifx';

export function isIndex(n) { return n || n === 0; };

export default function Solitaire() {

  let data = this.data = {
  };

  const onSettleEnd = (fxDataSettle) => {
    fxDataSettle.doEnd();
  };

  let fxSettle = new Fx(data, 'settle', onSettleEnd);

  const onSelectedEnd = (fxDataSelected) => {

    fxDataSelected.doEnd();

    if (!fxDataSelected.settleFx()) {
      fxDataSelected.endCancel();
    }
    let fxDataSettle = fxDataSelected.settleFx();

    fxSettle.begin(fxDataSettle);
  };

  let fxSelected = new Fx(data, 'selected', onSelectedEnd);

  const onRevealEnd = ({ n, card }) => {
    let stack = data.stacks[n];
    stack.add1([card]);
  };

  let fxReveal = new Fx(data, 'reveal', onRevealEnd);


  const onAddHoleEnd = ({ dstHoleN, card }) => {
    let hole = data.holes[dstHoleN];

    hole.add(card);
  };

  let fxAddHole = new Fx(data, 'addhole', onAddHoleEnd);

  this.stack = n => data.stacks[n];
  this.drawStack = () => data.drawStack;
  this.showStack = () => data.showStack;
  this.hole = n => data.holes[n];

  let fxDataSelectedDraw = new solifx.SoliFxSelectedDraw(this),
      fxDataSelectedStack = new solifx.SoliFxSelectedStack(this),
      fxDataSelectedHole = new solifx.SoliFxSelectedHole(this);

  this.deal = () => {
    if (busyFxs()) {
      return;
    }

    data.showStack.forEach(_ => data.drawStack.unshift(_));

    let card = data.drawStack.pop();

    data.showStack = [];
    data.showStack.push(card);
  };

  this.selectHole = (srcHoleN, epos, decay) => {
    if (busyFxs()) {
      return;
    }


    let hole = data.holes[srcHoleN];

    if (!hole.canRemove()) {
      return;
    }

    fxDataSelectedHole.doBegin(srcHoleN, epos, decay);
    fxSelected.begin(fxDataSelectedHole);
  };

  this.selectDraw = (epos, decay) => {

    if (busyFxs()) {
      return;
    }

    fxDataSelectedDraw.doBegin(epos, decay);
    fxSelected.begin(fxDataSelectedDraw);
  };

  this.select = (stackN, cardN, epos, decay) => {

    if (busyFxs()) {
      return;
    }

    fxDataSelectedStack.doBegin(stackN, cardN, epos, decay);
    fxSelected.begin(fxDataSelectedStack);
  };

  this.moveSelect = (epos) => {
    let fxData = fxSelected.value();
    if (fxData) {
      fxData.doUpdate(epos);
    }
  };

  this.endSelect = (dstStackN) => {
    let fxData = fxSelected.value();
    if (fxData) {
      fxData.endStack(dstStackN);
    }
  };

  this.endTap = () => {
    fxSelected.end();
  };

  this.endSelectHole = (dstHoleN) => {
    let fxData = fxSelected.value();
    if (fxData) {
      fxData.endHole(dstHoleN);
    }
  };

  let deck = makeOneDeck();

  const makeStack = (n, empty) => {
    let hidden = [];
    for (let i = 0; i < empty; i++) {
      hidden.push(deck.draw());
    }
 
    let front = [deck.draw()];

    return new SoliStack(n, hidden, front);
  };

  const makeHole = (cards) => {
    return new SoliHole(cards);
  };

  this.init = () => {
    deck.shuffle();

    data.stacks = [
      makeStack(0, 0),
      makeStack(1, 1),
      makeStack(2, 2),
      makeStack(3, 3),
      makeStack(4, 4),
      makeStack(5, 5),
      makeStack(6, 6)
    ];

    data.drawStack = deck.drawRest();
    data.showStack = [];

    data.holes = [
      makeHole([]),
      makeHole([]),
      makeHole([]),
      makeHole([])
    ];
  };

  this.revealStack = stack => {
    if (!stack.canReveal()) {
      return;
    }

    let last = stack.reveal1();
    fxReveal.begin({ n: stack.n,
                     card: last });
  };

  this.addHole = (dstHoleN, card) => {
    fxAddHole.begin({
      dstHoleN,
      card
    });
  };

  const busyFxs = () => {
    return fxSelected.value() ||
      fxSettle.value() ||
      fxReveal.value() ||
      fxAddHole.value();
  };

  const updateFxs = (delta) => {
    fxSelected.update(delta);
    fxSettle.update(delta);
    fxReveal.update(delta);
    fxAddHole.update(delta);
  };

  this.update = (delta) => {
    updateFxs(delta);
  };
}

const canStack = (c1, c2) => 
      c1.color !== c2.color && c1.sRank === c2.sRank + 1;

const canTop = c1 =>
      c1.rank === 'king';

function SoliStack(n, hidden, front) {
  
  this.n = n;
  this.front = front;
  this.hidden = hidden;

  this.cut1 = n => front.splice(n, front.length - n);


  this.add1 = cards => {
    cards.forEach(_ => front.push(_));
  };

  this.reveal1 = () => {
    return hidden.pop();
  };

  const top = () => front[front.length - 1];

  this.canAdd = cards => {
    let t = top(),
        t2 = cards[0];

    if (!t) {
      return canTop(t2);
    }

    return canStack(t, t2);
  };

  this.canReveal = () => front.length === 0 && hidden.length > 0;

}

function canStackHoleAce(c1) {
  return c1.rank === 'ace';
}

function canStackHole(c1, c2) {
  return c1.suit === c2.suit && c1.sRank === c2.sRank - 1;
}

function SoliHole(cards) {

  this.top = () => cards[cards.length - 1];

  this.remove = () => cards.pop();

  this.add = card => {
    cards.push(card);
  };

  this.canRemove = () => cards.length > 0;

  this.canAdd = cards => {
    if (cards.length !== 1) {
      return false;
    }

    let t = this.top(),
        t2 = cards[0];


    if (!t) {
      return canStackHoleAce(t2);
    } else {
      return canStackHole(t, t2);
    }
  };

  this.isDone = () => {
    return false;
  };
}
