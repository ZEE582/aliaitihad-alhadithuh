const crypto = require('crypto');

const CONSONANTS = 'bcdfghjkmnpqrstvwxz';
const VOWELS = 'aeiou';
const DIGITS = '23456789';

function generateTempPassword() {
  const pick = (chars) => chars[crypto.randomInt(chars.length)];
  return [
    pick(CONSONANTS), pick(VOWELS), pick(CONSONANTS),
    pick(VOWELS), pick(CONSONANTS), pick(VOWELS),
    pick(DIGITS), pick(DIGITS)
  ].join('');
}

module.exports = { generateTempPassword };