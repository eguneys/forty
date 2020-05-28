export const cols = 5;
export const rows = 5;

export const allPos = (function() {
  const res = [];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      res.push([j, i]);
    }
  }
  return res;
})();

export const allCols = (row) => {
  const res = [];
  for (var i = 0; i < cols; i++) {
    res.push([i, row]);
  }
  return res;
};

export const allRows = () => {
  const res = [];
  for (var i = 0; i < rows; i++) {
    res.push(i);
  }
  return res;
};

export const startingPos = [
  [0, 0],
  [rows - 1, 0]
];

export const testPos = [
  [0, cols - 1],
  [0, cols - 2],
  [0, cols - 3]
];

export function pos2key(pos) {
  return pos[0] + '.' + pos[1];
};

export function key2pos(key) {
  return key.split('.').map(_ => parseInt(_));
}

export function posNeighbor(pos, v) {
  let x = pos[0] + v[0],
      y = pos[1] + v[1];

  if (x < 0 || x >= cols ||
      y < 0 || y >= rows) {
    return null;
  }
  return [x, y];
}
