import './style.css';
import { Row } from './row';
import { sample } from 'st-utils';
import { wordsArray } from './words-array';
import { Suggestions } from './suggestions';
import { Words } from './words';
import { Subscription } from 'rxjs';

const wordsElement = document.querySelector<HTMLDivElement>('.words')!;
const completeInputButton = document.querySelector<HTMLButtonElement>('.complete-input')!;
const completeSelectionButton = document.querySelector<HTMLButtonElement>('.complete-selection')!;

const rows = Array.from({ length: 6 }, () => new Row(wordsElement));
let selectedIndex = -1;
let subscription: Subscription | undefined;

completeInputButton.addEventListener('click', () => {
  rows[selectedIndex].completeInput();
  completeInput();
});

completeSelectionButton.addEventListener('click', () => {
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

completeSelection();

const words = new Words(wordsArray);

function suggestWords(): void {
  const row = rows[selectedIndex - 1];
  if (!row?.isSelectionCompleted) {
    const randomWords = Array.from({ length: 5 }, () => sample(wordsArray)!);
    new Suggestions(randomWords);
    return;
  }
  const letters = row.getLetters();
  const wordsSuggestion = words.process(letters).getWordsSuggestions();
  if (selectedIndex === 1) {
    wordsSuggestion.unshift(sample(wordsSuggestion)!);
  }
  new Suggestions(wordsSuggestion);
}

suggestWords();
