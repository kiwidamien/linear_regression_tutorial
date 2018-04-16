const datasets = {
  linearSet: [
    {x: 44.0, y: 26.40},
    {x: 60.0, y: 61.60},
    {x: 61.0, y: 63.80},
    {x: 62.0, y: 66.00},
    {x: 63.0, y: 68.20},
    {x: 70.0, y: 83.60},
    {x: 75.0, y: 94.60},
    {x: 82.5, y: 111.10},
    {x: 90.0, y: 127.60},
    {x: 86.0, y: 118.80},
    {x: 96.0, y: 140.80}
  ]
};


datasets['linearNoise'] = datasets.linearSet.map((loc) => {
  return {x: loc.x, y: loc.y + 12*Math.random()}
});

datasets['quadratic'] = datasets.linearSet.map((loc) => {
  return {x: loc.x, y: 2.8*(loc.x-20) - 0.014*loc.x*loc.x}
});

export default datasets;
