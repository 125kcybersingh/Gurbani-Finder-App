/**
 * Matching service exports
 */

export { fuzzyMatchGurmukhi, getShabadFromLine, MatchResult } from './fuzzyMatch';
export {
  searchByFirstLettersGurmukhi,
  searchByFirstLettersRoman,
  FirstLetterMatch,
} from './firstLetter';
export {
  removeVishraams,
  normalizeGurmukhiForMatching,
  extractFirstLetters,
} from './normalize';

