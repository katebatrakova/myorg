import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { Hero } from '../../hero';
import * as HeroActions from './hero.actions';
import * as AppState from '../../state/app.state';

// Extends the app state to include the Hero state.
// This is required because products are lazy loaded.
// So the reference to HeroState cannot be added to app.state.ts directly.
export interface State extends AppState.State {
  heroes: HeroState;
}

/* Heroes state interface*/
export interface HeroState {
  heroes: Hero[];
  currentHeroId: number | null;
  error: string;
}

const initialState = {
  heroes: [],
  currentHeroId: null,
  error: '',
};

/* build a feature SELECTOR to retrieve a piece of state */
const getHeroFeatureState = createFeatureSelector<HeroState>('heroes'); //specify interface as generic arg

/* build SELECTORS for a specific state property */
export const getHeroes = createSelector(
  getHeroFeatureState,
  (state) => state.heroes
);

export const getCurrentHeroId = createSelector(
  getHeroFeatureState,
  (state) => state.currentHeroId
);

export const getCurrentHero = createSelector(
  getHeroFeatureState,
  getCurrentHeroId,
  (state, currentHeroId) => {
    return currentHeroId
      ? state.heroes.find((h) => h.id === currentHeroId)
      : null;
  }
);

export const getError = createSelector(
  getHeroFeatureState,
  (state) => state.error
);

// after building the reducer 1. go to app.module to update the store initialization, 2. and then ready to dispatch an action from the component based on user events
// congifure the reducer to listen for loadHeroesSuccess action.
export const heroReducer = createReducer(
  // initial store state for the hero slice
  initialState,
  // on() for each action this reducer handles
  on(
    HeroActions.loadHeroesSuccess,
    (state, action): HeroState => {
      return {
        // spread the existing state effectively making a copy
        ...state,
        heroes: action.heroes,
        error: '',
      };
    }
  ),
  on(HeroActions.loadHeroesFail, (state, action) => {
    console.log(action.error, 'action.error in loadHeroesFail');

    return {
      ...state,
      heroes: [],
      error: action.error,
    };
  }),
  on(
    HeroActions.setCurrentHero,
    (state, action): HeroState => {
      return {
        ...state,
        currentHeroId: action.currentHeroId,
      };
    }
  ),
  // After a delete, the currentProduct is null.
  on(
    HeroActions.deleteHeroSuccess,
    (state, action): HeroState => {
      return {
        ...state,
        heroes: state.heroes.filter((product) => product.id !== action.heroId),
        currentHeroId: null,
        error: '',
      };
    }
  ),
  on(
    HeroActions.deleteHeroFailure,
    (state, action): HeroState => {
      return {
        ...state,
        error: action.error,
      };
    }
  ),
  on(
    HeroActions.updateHeroSuccess,
    (state, action): HeroState => {
      const updatedHeroes = state.heroes.map((item) =>
        action.hero.id === item.id ? action.hero : item
      );
      return {
        ...state,
        heroes: updatedHeroes,
        currentHeroId: action.hero.id,
        error: '',
      };
    }
  ),
  on(
    HeroActions.updateHeroFail,
    (state, action): HeroState => {
      return {
        ...state,
        error: action.error,
      };
    }
  ),
  on(
    HeroActions.createHeroSuccess,
    (state, action): HeroState => {
      return {
        ...state,
        heroes: [...state.heroes, action.hero],
        currentHeroId: action.hero.id,
        error: '',
      };
    }
  ),
  on(
    HeroActions.createHeroFailure,
    (state, action): HeroState => {
      return {
        ...state,
        error: action.error,
      };
    }
  )
);
