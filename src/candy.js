import { topPoss, bottomPoss, fallPoss,
         allKeys, key2pos, pos2key,
         allResources,
         randomResource, 
         neighborPoss } from './candyutil';

import PMaker from './pmaker';
import ipol from './ipol';

export default function Candy() {
  const data = this.data = {
    resources: {},
    ground: {},
    fxs: {}
  };

  let frame;

  const onFallEnd = ({ from, to, resource }) => {
    let fromG = ground(from);
    let toG = ground(to);
    toG.trail = false;
    toG.empty = false;
    fromG.trail = false;
  };

  const onScoresEnd = ({value, resource}) => {
    data.resources[resource].value += value;
  };

  let fxScores = {};
  for (let key of allResources) {

    let fx = {};
    fxScores[key] = new Fx(fx, 'scores', onScoresEnd);

    data.resources[key] = {
      value: 0,
      fx
    };
  }

  const onCollectEnd = ({ keys, resource }) => {
    let value = keys.length;
    fxScores[resource].begin({
      value,
      resource
    });
  };

  let fxCollect = new Fx(data, 'collects', onCollectEnd);

  let fxFalls = {};
  allKeys.forEach(key => {

    let fx = {};
    fxFalls[key] = new Fx(fx, 'falls', onFallEnd);
    data.fxs[key] = fx;
  });

  this.init = () => {
    frame = 0;
    data.ground = {};

    allKeys.forEach(key => {
      data.ground[key] = {
        key,
        trail: false,
        empty: true,
        resource: randomResource(),
        frame
      };
    });

  };

  const ground = key => data.ground[key];
  const resource = key => data.ground[key].resource;

  const sameNeighbors = (key) => {
    let seekResource = resource(key);
    let result = [];
    sameNeighborsHelper(key, seekResource, [], result);
    return result;
  };

  const sameNeighborsHelper = (key, seekResource, visited, result) => {
    let pos = key2pos(key);
    let neighbors = neighborPoss(pos);
    let _resource = resource(key);
    visited.push(key);
    if (_resource === seekResource) {
      result.push(key);
      let unseens = neighbors.filter(pos => !visited.includes(pos2key(pos)));
      unseens.forEach(_ => 
        sameNeighborsHelper(pos2key(_), seekResource, visited, result));
    }
  };

  this.tap = (key) => {
    let neighbors = sameNeighbors(key);
    if (neighbors.length > 2) {
      beginConsume(neighbors, resource(key));
    }
  };

  const beginConsume = (keys, resource) => {
    keys.forEach(key => {
      let g = ground(key);
      g.empty = true;
    });

    fxCollect.begin({
      keys,
      resource
    });
  };

  const beginFall = (fromKey, toKey) => {
    let fromG = ground(fromKey);
    let toG = ground(toKey);

    fromG.empty = true;
    fromG.trail = true;
    toG.resource = fromG.resource;

    fxFalls[toKey].begin({
      to: toKey,
      from: fromKey,
      resource: fromG.resource
    });
  };

  const updateFalls = (delta) => {
    for (let key in data.ground) {
      let pos = key2pos(key);
      let g = ground(key);
      if (g.frame === frame) {
        continue;
      }
      g.frame = frame;
      if (g.empty) {
        let fP = fallPoss(pos);
        if (fP) {
          let fK = pos2key(fP);
          let fG = ground(fK);

          if (!fG.empty) {
            fG.frame = frame;
            beginFall(fK, key);
          }
        } else {

        }
      }
    }
  };

  const beginNewPop = key => {
    let g = ground(key);
    g.resource = randomResource();
    g.trail = false;
    g.empty = false;
  };

  const updateNewPops = () => {
    for (let pos of topPoss) {
      let key = pos2key(pos);
      let g = ground(key);
      if (!g.trail && g.empty) {
        beginNewPop(key);
      }
    }
    for (let pos of bottomPoss) {
      let key = pos2key(pos);
      let g = ground(key);
      if (!g.trail && g.empty) {
        beginNewPop(key);
      }
    }
  };

  const updateFxs = delta => {
    fxCollect.update(delta);
    for (let key in fxScores) {
      fxScores[key].update(delta);
    }
    for (let key in fxFalls) {
      fxFalls[key].update(delta);
    }
  };
  
  this.update = (delta) => {
    frame++;
    updateFxs(delta);
    updateNewPops(delta);
    updateFalls(delta);
  };
  
  
}

function Fx(data, key, onEnd = () => {}) {

  let state = {};

  this.begin = (value) => {
    state.value = value;
    data[key] = state;
  };

  const end = () => {
    onEnd(state.value);
    state.value = undefined;
    delete data[key];
  };

  this.update = (delta) => {
    if (state.end) {
      state.end = false;
      end();
    }
  };
}

function ViewIPol(data, key, duration) {
  let pRes = new PMaker({ name: `View IPol ` + key });
  let iPol = new ipol(0, 0, {});

  this.begin = (value) => {
    data[key] = {
      value,
      iPol
    };
    iPol.both(0, 1);
    return pRes.begin();
  };

  this.update = (delta) => {
    iPol.update(delta / duration);

    if (data[key]) {
      let vPol = iPol.value();
      data[key].i = vPol;

      if (iPol.settled()) {
        delete data[key];
        pRes.resolve();
      }
    }
  };
}
