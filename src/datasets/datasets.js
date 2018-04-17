const xPoints1 = [44.0, 60.0, 61.0, 62.0, 63.0, 70.0, 75.0, 82.5, 90.0, 86.0, 96.0];
const xPoints2 = [...xPoints1, 100.0, 105.0,101.2, 40.0,35.0];

const datasets = {};

datasets['linearSet'] = xPoints1.map(x => {
  return {x: x, y: 2.2*(x - 32)};
});

datasets['linearNoise'] = xPoints1.map((loc) => {
  return {x: loc, y: 1.8*(loc - 10) + 24*Math.random()};
});

datasets['quadratic'] = xPoints2.map(x => {
  return {x: x, y: 2.9*(x-15) - 0.015*x*x};
});

export default datasets;
