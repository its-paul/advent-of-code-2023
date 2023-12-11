import { open } from "node:fs/promises";

async function prep() {
  const file = await open(process.cwd() + "/day-4/input");
  const cards = [];

  for await (const line of file.readLines()) {
    cards.push(line.substring(9).trim());
  }

  return cards;
}

function getCardPoints(line) {
  const [first, second] = line.split(/\s+\|\s+/);
  const winners = first.split(/\s+/).map((s) => parseInt(s.trim(), 10));
  const myNumbers = second.split(/\s+/).map((s) => parseInt(s.trim(), 10));
  const matches = winners.filter((n) => myNumbers.indexOf(n) > -1);

  const score =
    matches.length > 1
      ? Math.pow(2, matches.length - 1)
      : matches.length === 1
      ? 1
      : 0;

  return [score, matches.length];
}

const cardList = await prep();
const cardPointValues = cardList.map(getCardPoints);
const pointTotal = cardPointValues.reduce(
  (score, [cardValue]) => score + cardValue,
  0
);

console.log(`Point total:`, pointTotal);

const copies = new Array(cardList.length).fill(1);
for (let i = 0; i < cardPointValues.length; i++) {
  const [, n] = cardPointValues[i];

  for (let j = 1; j <= n; j++) {
    copies[i + j] += copies[i];
  }
}

console.log(
  `Number of copies + originals:`,
  copies.reduce((total, n) => total + n, 0)
);
