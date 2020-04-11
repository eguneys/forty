import * as PIXI from 'pixi.js';

export default function sprites(resources) {

  const texture = name => resources[name].texture;
  const ssTextures = name => resources[name].spritesheet.textures;

  const mhud = (x, y, w, h) => frameTexture(texture('mhud'), x, y, w, h);

  return {
    'menubg9': slice9(texture('mhud'), 0, 16, 16, 16),
    'upgradebg9': slice9(texture('mhud'), 48, 16, 16, 32 / 3),
    'letters': letters(texture('mletters')),
    'menuclose': mhud(32, 0, 16),
    'toggleOn': mhud(0, 0, 32, 16),
    'toggleOff': mhud(64, 0, 32, 16)
  };
}

const letters = (texture, x = 0, y = 0, size = 16) => {
  let mFrame = (x, y, w, h) => frameTexture(texture, x, y, w, h);

  let res = {};

  ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((_, i) => 
    res[_] = mFrame(x + i * size, y, size, size));
  ['H', 'I', 'J', 'K', 'L', 'M', 'N'].forEach((_, i) => 
    res[_] = mFrame(x + i * size, y + size, size, size));
  ['O', 'P', 'Q', 'R', 'S', 'T', 'U'].forEach((_, i) => 
    res[_] = mFrame(x + i * size, y + size * 2, size, size));
  ['V', 'W', 'X', 'Y', 'Z'].forEach((_, i) => 
    res[_] = mFrame(x + i * size, y + size * 3, size, size));

  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((_, i) => 
    res[_] = mFrame(x + i * size, y + size * 4, size, size));

  ['?', '.', '+', '-', '/', ','].forEach((_, i) =>
    res[_] = mFrame(x + (8 + i) * size, y, size, size));

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

const animationTextures = (textures, rName, frames) => {
  let res = [];
  for (let i = 0; i < frames; i++) {
    let name = rName.replace('%', i);
    res.push(textures[name]);
  }
  return res;
};