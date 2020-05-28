import * as mu from 'mutilz';

import { testPos,
         startingPos, 
         allPos,
         pos2key,
         key2pos, 
         posNeighbor} from './fortyutils';

import { makeOneDeck, mergeMap, canMerge } from './deck';

import Fx from './fxs';

export default function FortyGame() {
  
  let data = this.data = {
    board: new Forty(this)
  };

  this.init = () => {
    data.board.init();
  };

  this.update = () => {
    data.board.update();
  };

}

function Forty(game) {

  let deck = makeOneDeck();

  let data = this.data = {
  };

  let vForce;

  allPos.forEach(pos => {
    let key = pos2key(pos);
    data[key] = new One(this, key);
  });

  const mapOnes = fn => {
    allPos.forEach(pos => {
      let key = pos2key(pos);
      fn(data[key], key, pos);
    });
  };

  this.init = () => {
    mapOnes(_ => _.init());

    [...startingPos,
     ...testPos].forEach(pos => {
      let key = pos2key(pos);
      let shape = deck.drawOne();
      data[key].init(shape);
    });
  };


  this.userSwipe = (vDir) => {
    vForce = vDir;
  };

  this.doMove = (orig, dest) => {
    let o = data[orig],
        d = data[dest];

    d.init(o.data.shape);
    o.init();
  };

  this.doMerge = (orig, dest) => {
    let o = data[orig],
        d = data[dest];

    d.init(mergeMap[o.data.shape]);
    o.init();
  };

  this.doSpawn = (orig) => {
    let o = data[orig];

    o.init(deck.drawOne());
  };

  const spawnOne = () => {
    let ems = [];

    mapOnes(_ => {
      if (_.empty()) {
        ems.push(_);
      }
    });

    if (ems.length === 0) {
      console.log('game over');
    } else {
      let o = mu.arand(ems);
      o.applySpawn();
    }
  };

  const endApplyForce = () => {
    vForce = undefined;
    spawnOne();
  };

  const applyForceToOnes = (vForce) => {
    let movingFound = false;
    mapOnes((one, key, pos) => {
      let nPos = posNeighbor(pos, vForce),
          nKey,
          neighbor;

      if (nPos) {
        nKey = pos2key(nPos);
        neighbor = data[nKey];
      }

      movingFound = one.applyForce(vForce, nPos, neighbor) || movingFound;
    });

    if (!movingFound) {
      endApplyForce();
    }
  };

  const onesBusy = () => {
    let res;
    mapOnes(_ => res = res || _.busy());
    return res;
  };

  const updateForce = () => {
    if (vForce && !onesBusy()) {
      applyForceToOnes(vForce);
    }
  };

  this.update = () => {
    updateForce();
    mapOnes(_ => _.update());
  };

}

function One(forty, orig) {

  let data = this.data = {};

  const onMovingEnd = ({dest}) => {
    forty.doMove(orig, dest);
  };

  const onMergingEnd = ({ dest }) => {
    forty.doMerge(orig, dest);
  };

  const onSpawnEnd = () => {
    forty.doSpawn(orig);
  };

  let fxSpawn = new Fx(data, 'spawn', onSpawnEnd);
  let fxMoving = new Fx(data, 'moving', onMovingEnd);
  let fxMerging = new Fx(data, 'merging', onMergingEnd);
  let fxStill = new Fx(data, 'still');

  let fxMergeInto = new Fx(data, 'mergeInto');

  this.init = (shape) => {
    data.shape = shape;
  };

  this.empty = () => !data.shape;

  this.moving = () => fxMoving.value();

  this.merging = () => fxMerging.value();

  this.trail = () => {
    return this.empty() || this.moving() || this.merging();
  };

  this.applyMergeInto = (orig) => {
    fxMergeInto.begin({orig});
  };

  this.applyForce = (vForce, nPos, neighbor) => {
    if (this.busy()) {
      return false;
    }
    if (!nPos || this.empty()) {
      fxStill.begin({});
      return false;
    }

    if (neighbor.trail()) {
      fxMoving.begin({dest: pos2key(nPos)});
    } else if (canMerge(data.shape, neighbor.data.shape)) {
      fxMerging.begin({ dest: pos2key(nPos) });
      neighbor.applyMergeInto(orig);
    } else {
      return false;
    }
    return true;
  };

  this.applySpawn = () => {
    if (this.empty()) {
      fxSpawn.begin({});
      return true;
    } else {
      return false;
    }
  };

  this.busy = () => {
    return !!fxSpawn.value() ||
      !!fxMoving.value() ||
      !!fxMerging.value() ||
      !!fxStill.value() ||
      !!fxMergeInto.value();
  };

  this.update = () => {
    fxMergeInto.update();
    fxSpawn.update();
    fxMoving.update();
    fxMerging.update();
    fxStill.update();
  };
}
