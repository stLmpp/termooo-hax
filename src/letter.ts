import { BehaviorSubject, fromEvent, map, Subject, Subscription, takeUntil } from 'rxjs';

export class Letter {
  constructor(private readonly row: HTMLDivElement, public readonly index: number) {
    this._element = document.createElement('input');
    this._element.classList.add('letter');
    this._element.classList.add('form-control');
    this._element.maxLength = 1;
    this.row.appendChild(this._element);
    this._inputSubscription$ = fromEvent(this._element, 'input')
      .pipe(
        takeUntil(this._destroy$),
        map(() => (this._element.value ?? '').toUpperCase())
      )
      .subscribe(value => {
        this._element.value = value;
        this._value$.next(value);
      });
  }

  private readonly _destroy$ = new Subject<void>();
  private readonly _value$ = new BehaviorSubject<string>('');
  private readonly _element: HTMLInputElement;
  private readonly _inputSubscription$: Subscription;
  private _selectionSubscriptions$: Subscription[] = [];

  readonly value$ = this._value$.asObservable();

  hasLetter = false;
  isSameIndex = false;
  isCompleted = false;

  completeInput(): this {
    this._inputSubscription$.unsubscribe();
    this.isCompleted = true;
    this._selectionSubscriptions$ = [
      fromEvent(this._element, 'click').subscribe(() => {
        this.hasLetter = true;
        this.isSameIndex = true;
        this._element.classList.remove('not-same-index');
        this._element.classList.add('correct');
      }),
      fromEvent(this._element, 'contextmenu').subscribe(event => {
        event.preventDefault();
        this.hasLetter = true;
        this.isSameIndex = false;
        this._element.classList.remove('correct');
        this._element.classList.add('not-same-index');
      }),
      fromEvent(this._element, 'dblclick').subscribe(() => {
        this.hasLetter = false;
        this.isSameIndex = false;
        this._element.classList.remove('correct');
        this._element.classList.remove('not-same-index');
      }),
    ];
    return this;
  }

  completeSelection(): this {
    for (const subscription of this._selectionSubscriptions$) {
      subscription.unsubscribe();
    }
    this._element.disabled = true;
    return this;
  }

  getValue(): string {
    return this._value$.value;
  }
}
