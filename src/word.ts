export class Word {
  constructor(public readonly value: string) {
    this._lettersArray = value.split('');
    this._lettersSet = new Set(this._lettersArray);
  }

  private readonly _lettersArray: string[];
  private readonly _lettersSet: Set<string>;

  hasLetter(letter: string): boolean {
    return this._lettersSet.has(letter);
  }

  hasLetterAtPosition(letter: string, index: number): boolean {
    return this._lettersArray[index] === letter;
  }

  hasLetterNotAtPosition(letter: string, index: number): boolean {
    return this._lettersSet.has(letter) && !this.hasLetterAtPosition(letter, index);
  }
}
