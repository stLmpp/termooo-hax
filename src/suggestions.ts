import { Suggestion } from './suggestion';

export class Suggestions {
  constructor(words: string[]) {
    const parent = document.querySelector<HTMLDivElement>('.suggested')!;
    parent.innerHTML = '';
    const element = document.createElement('ul');
    element.classList.add('list-group');
    parent.appendChild(element);
    for (const word of words) {
      new Suggestion(element, word);
    }
  }
}
