import { Word } from './word';
import { Letter } from './letter';
import { shuffleArray } from './shuffle-array';

export class Words {
  constructor(wordsArray: string[]) {
    this._words = wordsArray.map(word => new Word(word));
  }

  private _words: Word[];

  process(letters: Letter[]): this {
    for (const letter of letters) {
      this._words = this._words.filter(word => {
        if (letter.hasLetter) {
          if (letter.isSameIndex) {
            return word.hasLetterAtPosition(letter.getValue(), letter.index);
          } else {
            return word.hasLetterNotAtPosition(letter.getValue(), letter.index);
          }
        }
        if (letters.filter(_letter => _letter.hasLetter).some(_letter => _letter.getValue() === letter.getValue())) {
          return word.hasLetterNotAtPosition(letter.getValue(), letter.index);
        } else {
          return !word.hasLetter(letter.getValue());
        }
      });
    }
    return this;
  }

  getWordsSuggestions(): string[] {
    return this._words.map(word => word.value);
  }

  getWordsSuggestionsShuffled(): string[] {
    return shuffleArray(this.getWordsSuggestions());
  }
}
