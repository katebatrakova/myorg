/* Load Heroes - 3 Actions for Load complex operations */
import { createAction, props } from '@ngrx/store';
import { Hero } from '../../hero';

/* GET */
export const loadHeroes = createAction(
  // no associated data for this one, when it's dispatched
  // the app issues an http request to retrieve data for our page
  '[Hero] Loading the heroes'
);

export const loadHeroesSuccess = createAction(
  // upon a successfull HTTP response
  '[Hero] Load Heroes Success',
  // defining the structure of the return data
  props<{ heroes: Hero[] }>()
);

export const loadHeroesFail = createAction(
  '[Hero] Failure Loading the heroes',
  props<{ error: string }>()
);

/* SET current hero */
export const setCurrentHero = createAction(
  '[Hero] Set Current Hero',
  props<{ currentHeroId: number }>()
);

/* DELETE */
export const deleteHero = createAction(
  '[Hero] Delete Product',
  props<{ heroId: number }>()
);

export const deleteHeroSuccess = createAction(
  '[Hero] Delete Hero Success',
  props<{ heroId: number }>()
);

export const deleteHeroFailure = createAction(
  '[Hero] Delete Hero Fail',
  props<{ error: string }>()
);

/* UPDATE */
export const updateHero = createAction(
  '[Hero] Update  Hero',
  props<{ hero: Hero }>()
);

export const updateHeroSuccess = createAction(
  '[Hero] Update  Hero Success',
  props<{ hero: Hero }>()
);

export const updateHeroFail = createAction(
  '[Hero] Update  Hero Fail',
  props<{ error: string }>()
);

/* CREATE */
export const createHero = createAction(
  '[Hero] Create  Hero',
  props<{ hero: Hero }>()
);

export const createHeroSuccess = createAction(
  '[Hero] Create  Hero Success',
  props<{ hero: Hero }>()
);

export const createHeroFailure = createAction(
  '[Hero] Create  Hero Fail',
  props<{ error: string }>()
);
