import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError, concatMap } from 'rxjs/operators';
import { HeroService } from '../../hero.service';

import * as HeroActions from './hero.actions';

@Injectable()
export class HeroEffects {
  constructor(
    //actions$ omits an action every time one is dispatched in our app after thelatest state has been reduced
    private actions$: Actions,
    private heroService: HeroService
  ) {}
  // configure the Reducer after, to listen for this action and add the heroes to the store
  loadHeroes$ = createEffect(() => {
    // actions$ listens to actions
    return this.actions$.pipe(
      //  ofType operator accepts an action we want to listen for
      ofType(HeroActions.loadHeroes),
      // mergeMap maps over each ommited action, calling heroService, and merges returned from service observables into singl stream
      // heroService returns an observable so we use another pipe to pass in map operator
      // to mergeMap to map over ommited action and return the result of calling the service
      mergeMap(() =>
        // issue http request to load the heroes on the backend server. The service returns an observable
        this.heroService.getHeroes().pipe(
          // map over the result of heroService and dispatch a success action. Reducer listens for this action.
          map((heroes) => HeroActions.loadHeroesSuccess({ heroes })),
          catchError((error) =>
            // make  a new Observable
            of(HeroActions.loadHeroesFail({ error: error }))
          )
        )
      )
    );
  });

  deleteHero$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HeroActions.deleteHero),
      mergeMap((action) =>
        this.heroService.deleteHero(action.heroId).pipe(
          map(() => HeroActions.deleteHeroSuccess({ heroId: action.heroId })),
          catchError((error) => of(HeroActions.deleteHeroFailure({ error })))
        )
      )
    );
  });

  updateHero$ = createEffect(() => {
    return this.actions$.pipe(
      // each time an action is dispatched we filter out all but the updateHero actions
      ofType(HeroActions.updateHero),
      //concatMap to match and flatten 2 observables: 1 from action, 1 from service
      concatMap((action) =>
        // issue http request to update the hero on the backend server. This method returns an observable
        this.heroService.updateHero(action.hero).pipe(
          map((hero) => HeroActions.updateHeroSuccess({ hero })),
          catchError((error) => of(HeroActions.updateHeroFail({ error })))
        )
      )
    );
  });

  createHero$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HeroActions.createHero),
      mergeMap((action) =>
        this.heroService.addHero(action.hero).pipe(
          map((hero) => HeroActions.createHeroSuccess({ hero }))
          // catchError((error) => of(HeroActions.createHeroFailure({ hero })))
        )
      )
    );
  });
}

// We use mergeMap to map over actions$ observbale and merge any inner observables returned from calling service
// into single observable stream
