import { open } from "node:fs/promises";

async function calculate(lineParseFn) {
  const file = await open(process.cwd() + "/day-1/input");
  const rows = [];
  let total = 0;

  for await (const line of file.readLines()) {
    const number = lineParseFn(line);

    rows.push(number);
    total += number;
  }

  return [rows, total];
}

const WORDS2NUMBERS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

function parseNumbers(line, doNumParse = true, doStrParse = false) {
  const foundNumbers = [];

  if (doNumParse) {
    for (let i = 0; i < line.length; i++) {
      const parsedChar = parseInt(line[i], 10);

      if (!Number.isNaN(parsedChar)) {
        foundNumbers[i] = parsedChar;
      }
    }
  }

  if (doStrParse) {
    WORDS2NUMBERS.forEach((str, val) => {
      const regex = new RegExp(str, "g");
      const matches = [...line.matchAll(regex)].map((match) => match.index);

      matches.forEach((idx) => {
        foundNumbers[idx] = val;
      });
    });
  }

  const filtered = foundNumbers.filter((n) => typeof n === "number");

  const result = parseInt(
    filtered[0].toString() + filtered[filtered.length - 1].toString(),
    10
  );

  return result;
}

const p1 = await calculate((line) => parseNumbers(line, true, false));

console.log(`Part 1:`);
console.log(`Total:`, p1[1]);

const p2 = await calculate((line) => parseNumbers(line, true, true));

console.log(`Part 2:`);
console.log(`Total:`, p2[1]);
