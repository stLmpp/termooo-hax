import './style.css';
import { Row } from './row';
import { sample } from 'st-utils';
import { wordsArray } from './words-array';
import { Suggestions } from './suggestions';
import { Words } from './words';
import { fromEvent, Subscription } from 'rxjs';

const wordsElement = document.querySelector<HTMLDivElement>('.words')!;
const completeInputButton = document.querySelector<HTMLButtonElement>('.complete-input')!;
const completeSelectionButton = document.querySelector<HTMLButtonElement>('.complete-selection')!;

const rows = Array.from({ length: 6 }, () => new Row(wordsElement));
let selectedIndex = -1;
let subscription: Subscription | undefined;

fromEvent(completeInputButton, 'click').subscribe(() => {
  rows[selectedIndex].completeInput();
  completeInput();
});

fromEvent(completeSelectionButton, 'click').subscribe(() => {
  subscription?.unsubscribe();
  rows[selectedIndex].completeSelection();
  completeSelection();
});

function completeInput(): void {
  completeSelectionButton.disabled = false;
  completeInputButton.disabled = true;
}

function completeSelection(): void {
  selectedIndex++;
  subscription = rows[selectedIndex].fulfilled$.subscribe(fulfilled => {
    completeInputButton.disabled = !fulfilled;
  });
  completeSelectionButton.disabled = true;
  suggestWords();
}

const words = new Words(wordsArray);

function suggestWords(): void {
  const row = rows[selectedIndex - 1];
  if (!row?.isSelectionCompleted) {
    console.error(`Something went wrong here. rows[${selectedIndex - 1}] is undefined.`);
    return;
  }
  const letters = row.getLetters();
  const wordsSuggestion = words.process(letters).getWordsSuggestionsShuffled();
  new Suggestions(wordsSuggestion);
}

function suggestFirstWords(): void {
  const randomWords = Array.from({ length: 5 }, () => sample(wordsArray)!);
  new Suggestions(randomWords);
}

fromEvent(document, 'DOMContentLoaded').subscribe(() => {
  completeSelection();
  suggestFirstWords();
});
