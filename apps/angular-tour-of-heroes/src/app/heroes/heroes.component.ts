import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { FormControl, Validators } from '@angular/forms';

/* NgRx */
import { Store } from '@ngrx/store';
import * as HeroActions from './state/hero.actions';
import { getError, getHeroes } from './state/hero.reducer';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { State } from '../state/app.state';

// @Component is a decorator function that specifies the Angular metadata for the component.
@Component({
  selector: 'myorg-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  errorMessage$: Observable<string>;
  selectedHero: Hero;
  newHeroName: FormControl;

  constructor(private store: Store<State>, private router: Router) {
    // Commonly, the constructor shouldn't do anything.
    // Only for simple initialization such as wiring constructor parameters to properties
  }

  // initialization logic goes in ngOnInit() hook
  ngOnInit(): void {
    // Form control for a New Hero Name
    this.newHeroName = new FormControl('');

    /* LOAD the HEROES */
    this.heroes$ = this.store.select(getHeroes);

    this.store.dispatch(HeroActions.loadHeroes());
    this.errorMessage$ = this.store.select(getError);
  }

  /* SELECT a HERO */
  heroSelected(hero: Hero): void {
    this.store.dispatch(HeroActions.setCurrentHero({ currentHeroId: hero.id }));
    // navigate to the hero detail view
    this.router.navigate([`detail/${hero.id}`]);
  }

  /* DELETE a HERO */
  deleteHero(hero: Hero): void {
    if (hero && hero.id) {
      this.store.dispatch(HeroActions.deleteHero({ heroId: hero.id }));
    }
  }

  /*  ADD a HERO */
  add(name): void {
    console.log(name, 'name of a new hero');

    // let newHero = new Hero({
    //   name: name,
    // });

    let hero = { ...new Hero(), name: name };

    // createHero expect a hero object, it needs an id. The server  generates an id for the new hero
    if (name) {
      this.store.dispatch(HeroActions.createHero({ hero }));
    }
  }

  // GET HEROES async version waits for the Observable to emit the array of heroes.
  // getHeroes(): void {
  //   // asynchronously!
  //   this.heroService
  //     .getHeroes()
  //     // The subscribe() method passes the emitted array to the callback, which sets the component's heroes property.
  //     .subscribe((heroes) => (this.heroes = heroes));
  // }

  // delete(hero: Hero): void {
  //   // update its own list of heroes array
  //   this.heroes = this.heroes.filter((h) => {
  //     //iterating through ech hero and return those not matching with the hero to delete
  //     return h !== hero;
  //   });
  //   // nothing for the component to do with the Observable returned by heroService.delete() but it must subscribe anyway
  //   this.heroService.deleteHero(hero).subscribe();
  // }
}
