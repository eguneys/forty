export const one = 'tri';
export const two = 'square';

export const shapes = [one, two];

export const mergeMap = {
  [one]: two,
  [two]: one
};

export const canMerge = (s1, s2) => {
  return s1 === s2;
};

export const makeOneDeck = () => new Deck(shapes);

export function Deck(shapes) {

  let ones = shapes.slice(0, 1),
      twos = shapes.slice(1, 2);

  let all = [...ones, 
               ...twos];

  let bags = {
    ones: new Bag(ones),
    twos: new Bag(twos),
    all: new Bag(all)
  };

  const makeDraw = key => () => bags[key].draw();

  this.drawOne = makeDraw('ones');
  this.drawTwo = makeDraw('twos');
  this.drawAll = makeDraw('all');

}

function Bag(storeBase) {
  let store;

  const fill = () => {
    if (!store || store.length === 0) {
      store = storeBase.slice(0);
    }
  };

  this.draw = () => {
    fill();
    return store.pop();
  };
}
