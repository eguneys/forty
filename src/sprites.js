import * as PIXI from 'pixi.js';

export default function sprites(resources) {

  const json = name => resources[name].data;
  const texture = name => resources[name].texture;
  const ssTextures = name => resources[name].spritesheet.textures;

  const fT = atlas =>
        (x, y, w, h) => frameTexture(texture(atlas), x, y, w, h);

  const mall = fT('mall');
  const mhud = fT('mhud');

  return {
    'fletters': fletters(texture('fletters'), json('flettersjson')),
    'fkerning': json('flettersjson'),
    'pletters': fletters(texture('pletters'), json('plettersjson')),
    'pkerning': json('plettersjson'),
    'mbg': texture('mbg'),
    'mall': all(mall),
    'mhud': hud(mhud)
  };
}

const hud = (mhud) => {
  return {
    'score': mhud(0, 0, 32)
  };
};

const all = (mall) => {
  return {
    'tri': mall(0, 0, 32),
    'square': mall(32, 0, 32),
    'tri2square': animation(mall, 0, 32, 64, 32, 9)
  };
};

const animation = (mall, x, y, w, h, frames) => {
  let res = [];
  for (let i = 0; i < frames; i++) {
    res.push(mall(x + i * w, y, w, h));
  }
  return res;
};

const slice3 = (mall, x, y, w, h) => {
  return [
    mall(x, y, w, h),
    mall(x + w, y, w, h),
    mall(x + w * 2, y, w, h)
  ];
};

const fletters = (texture, json) => {
  let mFrame = (x, y, w, h) => frameTexture(texture, x, y, w, h);

  let res = {};
  for (let letter in json) {
    let data = json[letter];
    res[letter] = mFrame(data.x, data.y, data.w, data.h);
  }
  return res;
};

const slice9 = (texture, x, y, w, h) => {
  let mFrame = (x, y, w, h) => frameTexture(texture, x, y, w, h);

  return [
    mFrame(x, y, w, h),
    mFrame(x + w, y, w, h),
    mFrame(x + w * 2, y, w, h),
    mFrame(x, y + h, w, h),
    mFrame(x + w, y + h, w, h),
    mFrame(x + w * 2, y + h, w, h),
    mFrame(x, y + h * 2, w, h),
    mFrame(x + w, y + h * 2, w, h),
    mFrame(x + w * 2, y + h * 2, w, h)
  ];
};

const frameTexture = (texture, x, y, w, h = w) => {
  let rect = new PIXI.Rectangle(x, y, w, h);
  let t = new PIXI.Texture(texture);
  t.frame = rect;
  return t;
};
