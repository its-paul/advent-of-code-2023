import { readFile } from "node:fs/promises";

async function prep(filename = "input") {
  const file = await readFile(process.cwd() + `/day-6/${filename}`, "utf-8");

  return file.split(/\n/g).map((line) =>
    line
      .split(/\s+/g)
      .slice(1)
      .map((n) => parseInt(n, 10))
  );
}

const [time, dist] = await prep("input");

const results = time.map((t) => {
  const options = [];

  for (let j = 0; j < t; j++) {
    const distanceMoved = j * (t - j);

    options.push(distanceMoved);
  }

  return options;
});

console.log(`Pt 1:`);
console.log(
  results
    .map((options, raceId) => options.filter((mv) => mv > dist[raceId]).length)
    .reduce((total, n) => total * n, 1)
);

const realTime = parseInt(time.join(""), 10);
const realDist = parseInt(dist.join(""), 10);
let [min, max] = [0, realTime];

console.log(`Pt 2:`);
console.log(`Real time: ${realTime}; Real distance: ${realDist}`);

for (let i = 0; i < realTime; i++) {
  const minDist = min * (realTime - min);
  const maxDist = max * (realTime - max);

  if (minDist > realDist && maxDist > realDist) break;
  if (minDist <= realDist) min++;
  if (maxDist <= realDist) max--;
}

console.log(`Ways to win: ${max - min + 1}, bounds: [${min}, ${max}]`);
