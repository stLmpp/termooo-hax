import { Letter } from './letter';
import { combineLatest, map, Observable } from 'rxjs';

export class Row {
  constructor(private readonly parent: HTMLDivElement) {
    this._element = document.createElement('div');
    this._element.classList.add('row');
    this.parent.appendChild(this._element);
    this._letters = Array.from({ length: 5 }, (_, index) => new Letter(this._element, index));
    this.fulfilled$ = combineLatest(this._letters.map(letter => letter.value$)).pipe(
      map(letters => letters.every(Boolean))
    );
  }

  private readonly _element: HTMLDivElement;
  private readonly _letters: Letter[];

  readonly fulfilled$: Observable<boolean>;

  isInputCompleted = false;
  isSelectionCompleted = false;

  completeInput(): this {
    this.isInputCompleted = true;
    for (const letter of this._letters) {
      letter.completeInput();
    }
    return this;
  }

  completeSelection(): this {
    this.isSelectionCompleted = true;
    for (const letter of this._letters) {
      letter.completeSelection();
    }
    return this;
  }

  getWord(): string {
    return this._letters.map(letter => letter.getValue()).join('');
  }

  getLetters(): Letter[] {
    return [...this._letters];
  }
}
