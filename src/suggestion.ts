export class Suggestion {
  constructor(parent: HTMLUListElement, word: string) {
    const element = document.createElement('li');
    element.classList.add('list-group-item');
    element.innerText = word;
    parent.appendChild(element);
  }
}
