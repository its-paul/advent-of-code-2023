import { open } from "node:fs/promises";

const MAX_CUBES = {
  red: 12,
  green: 13,
  blue: 14,
};

async function calculate(fn, isPt2) {
  const file = await open(process.cwd() + "/day-2/input");
  const powers = [];
  let idSum = 0;

  for await (const line of file.readLines()) {
    let [id, draws] = line
      .replace("Game ", "")
      .split(":")
      .map((s) => s.trim());
    id = parseInt(id, 10);

    const result = fn(draws);

    console.log(`Game ${id}: ${result} (${line})`);

    if (typeof result === "boolean" && result) {
      idSum += id;
    } else {
      powers.push(Object.values(result).reduce((power, n) => power * n, 1));
    }
  }

  if (!isPt2) {
    return idSum;
  }

  return powers;
}

function isGamePossible(str) {
  const rounds = str.split("; ");
  const draws = rounds.map((rd) => rd.split(", "));

  for (let i = 0; i < draws.length; i++) {
    for (let j = 0; j < draws[i].length; j++) {
      const [count, colour] = draws[i][j].split(" ");

      if (count > MAX_CUBES[colour]) {
        return false;
      }
    }
  }

  return true;
}

function minViableCubes(str) {
  const rounds = str.split("; ");
  const draws = rounds.map((rd) => rd.split(", "));

  const reqCubes = {
    red: 0,
    green: 0,
    blue: 0,
  };

  for (let i = 0; i < draws.length; i++) {
    for (let j = 0; j < draws[i].length; j++) {
      const [count, colour] = draws[i][j].split(" ");

      reqCubes[colour] = Math.max(reqCubes[colour], count);
    }
  }

  return reqCubes;
}

const p1 = await calculate(isGamePossible);

console.log(`Part 1:`);
console.log(`Sum of possible game IDs:`, p1);

const p2 = await calculate(minViableCubes, true);

console.log(`Part 2:`);
console.log(
  `Sum of game set powers:`,
  p2.reduce((total, n) => total + n, 0)
);
