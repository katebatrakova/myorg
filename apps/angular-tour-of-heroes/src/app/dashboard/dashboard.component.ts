import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import * as HeroActions from '../heroes/state/hero.actions';
import { getError, getHeroes } from '../heroes/state/hero.reducer';
import { State } from '../state/app.state';

@Component({
  selector: 'myorg-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  errorMessage$;

  // inject the HeroService into a private heroService property
  constructor(
    private store: Store<State>,
    private heroService: HeroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // load top heroes
    this.store.dispatch(HeroActions.loadHeroes());
    this.heroes$ = this.store.select(getHeroes);
    // .subscribe((heroes) => (this.heroes = heroes.slice(1, 5))); //returning only four of the Top Heroes

    // watch for a error when loading data
    this.errorMessage$ = this.store.select(getError);
  }

  heroSelected(hero: Hero): void {
    console.log(hero.id, 'hero id  clicked');
    this.store.dispatch(HeroActions.setCurrentHero({ currentHeroId: hero.id }));
    // navigate to the hero detail view
    this.router.navigate([`detail/${hero.id}`]);
  }
}
