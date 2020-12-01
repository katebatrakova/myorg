import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
// ActivatedRoute to retrieve parameters from URL
import { ActivatedRoute, Router } from '@angular/router';
// location is a service for interacting with the browser
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import { Observable } from 'rxjs';
import { getCurrentHero } from '../heroes/state/hero.reducer';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import * as HeroActions from '../heroes/state/hero.actions';
import { State } from '../state/app.state';

@Component({
  selector: 'myorg-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  hero$: Observable<Hero>;
  heroName: FormControl;

  constructor(
    private route: ActivatedRoute, // holds information about the route to this instance of the HeroDetailComponent
    private location: Location,
    private router: Router,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    // Form control for Name
    this.heroName = new FormControl('');

    // Watch for changes to the currently selected hero
    this.hero$ = this.store
      .select(getCurrentHero)
      .pipe(tap((currentHero) => this.heroName.setValue(currentHero.name)));
  }

  // getHero(): void {
  //   // route.snapshot is a static image of the route information shortly after the component was created
  //   // (+) operator converts the string to a number
  //   const id = +this.route.snapshot.paramMap.get('id'); //paramMap holds route parameter values extracted from the URL
  //   this.heroService.getHero(id).subscribe((hero) => (this.hero = hero));
  // }

  // navigate backward one step in the browser's history stack
  goBack(): void {
    // this.location.back();
    this.router.navigate(['/heroes']);
  }

  //  save() persists hero name changes using the hero service updateHero() method

  // save(): void {
  //   this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
  // }

  saveHero(originalHero: Hero): void {
    // Copy over all of the original hero properties
    // This ensures values not on the form, such as the Id, are retained
    const hero = { ...originalHero, name: this.heroName.value };

    // update the hero  when data is returned
    this.store.dispatch(HeroActions.updateHero({ hero }));
  }
}
