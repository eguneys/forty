import AContainer from './acontainer';
import ASprite from './asprite';
import AAnimation from './aanimation';

import { fxHandler } from './util';

export default function One(play, ctx, bs) {

  const { textures } = ctx;

  const mall = textures['mall'];

  let { score, sMargin } = bs;

  let sWidth = score.width - sMargin * 2.0;

  let dSingle = new ASprite(this, ctx, {
    width: sWidth,
    height: sWidth
  });

  let container = this.container = new AContainer();
  const initContainer = () => {
    container.addChild(dSingle);
    dSingle.container.move(sMargin, sMargin);
  };
  initContainer();

  let one;

  this.init = (data) => {
    one = data;

    refresh();
  };

  const refresh = () => {
    dSingle.texture(mall[one.data.shape]);
  };

  const handleMoving = fxHandler({
    allowEnd: true,
    onBegin({ dest }) {
    },
    onUpdate(_, i) {
    },
    onEnd({dest}) {
      refresh();
    }
  }, () => one.data.moving);

  const handleMerging = fxHandler({
    allowEnd: true,
    onBegin() {
    },
    onUpdate(_, i) {
    },
    onEnd() {
      refresh();
    }
  }, () => one.data.merging);

  const handleStill = fxHandler({
    allowEnd: true,
    onBegin() {
    },
    onUpdate(_, i) {
    },
    onEnd() {
      refresh();
    }
  }, () => one.data.still);

  const handleSpawn = fxHandler({
    allowEnd: true,
    onBegin() {
    },
    onUpdate(_, i) {
    },
    onEnd() {
      refresh();
    }
  }, () => one.data.spawn);

  const handleMergeInto = fxHandler({
    allowEnd: true,
    onBegin() {
    },
    onUpdate(_, i) {
    },
    onEnd() {
      refresh();
    }
  }, () => one.data.mergeInto);

  this.update = delta => {
    handleMoving(delta);
    handleMerging(delta);
    handleStill(delta);
    handleSpawn(delta);
    handleMergeInto(delta);
    this.container.update(delta);
  };

  this.render = () => {
    this.container.render();
  };
}
