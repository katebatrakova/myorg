import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'myorg-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
})
export class HeroSearchComponent implements OnInit {
  // declaration of heroes$ as an Observable
  heroes$: Observable<Hero[]>;

  // searchTerms property is an RxJS Subject
  // Subject is both a source of observable values and an Observable itself
  // Every time the user types in the textbox, the binding calls search() with the textbox value,
  // The searchTerms becomes an Observable emitting a steady stream of search terms.
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term, 300ms pause between requests
      debounceTime(300),

      // ignore new term if same as previous term
      // ensures that a request is sent only if the filter text changed
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }
}
