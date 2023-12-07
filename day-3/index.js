import { open } from "node:fs/promises";

async function prep() {
  const file = await open(process.cwd() + "/day-3/input");
  const map = []; // 140, 140

  for await (const line of file.readLines()) {
    map.push(line.split(""));
  }

  return map;
}

function mapPartSymbols(map) {
  const symbols = new Set();
  const locations = {};

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const char = map[i][j];

      if (
        !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."].includes(char)
      ) {
        if (!Array.isArray(locations[char])) {
          locations[char] = [];
        }

        locations[char].push([i, j]);
        symbols.add(char);
      }
    }
  }

  return [symbols, locations];
}

function findAdjacentNumbers(map, symbolLocation) {
  const [y, x] = symbolLocation; // from x-1, y-1; to x+1, y+1
  const results = {};

  for (let i = y - 1; i <= y + 1; i++) {
    for (let j = x - 1; j <= x + 1; j++) {
      const char = map[i][j];
      const parsed = parseInt(char, 10);

      if (isNumber(parsed)) {
        let foundStart = false;
        let seekStart = j;
        while (!foundStart) {
          if (seekStart > 0 && isNumber(map[i][seekStart - 1])) {
            seekStart -= 1;
          } else {
            foundStart = true;
          }
        }

        let foundEnd = false;
        let seekEnd = j;
        while (!foundEnd) {
          if (seekEnd < map[i].length - 1 && isNumber(map[i][seekEnd + 1])) {
            seekEnd += 1;
          } else {
            foundEnd = true;
          }
        }

        const digits = [];
        for (let k = seekStart; k <= seekEnd; k++) {
          digits.push(map[i][k]);
        }

        const foundNumber = parseInt(digits.join(""), 10);
        results[`${i},${seekStart}`] = foundNumber;
      }
    }
  }

  return Object.values(results);
}

function isNumber(str) {
  return !Number.isNaN(parseInt(str, 10));
}

const map = await prep();
const [symbols, locations] = mapPartSymbols(map);

console.log(
  `Symbols:`,
  JSON.stringify(Array.from(symbols)),
  Object.values(locations).reduce((total, sc) => total + sc.length, 0)
);

const serials = Object.values(locations).reduce(
  (totalSum, symbol) =>
    totalSum +
    symbol.reduce(
      (symbolSum, loc) =>
        symbolSum +
        findAdjacentNumbers(map, loc).reduce(
          (instanceSum, n) => instanceSum + n,
          0
        ),
      0
    ),
  0
);

console.log(`Sum of all serial numbers:`, serials);

const gears = locations["*"].reduce((total, gearLoc) => {
  const nums = findAdjacentNumbers(map, gearLoc);

  if (nums.length === 2) {
    return total + nums[0] * nums[1];
  }

  return total;
}, 0);

console.log(`Sum of all gear ratios:`, gears);
