// new service imports the Angular Injectable symbol
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { Hero } from './hero';

import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

// Service class is annotated with the @Injectable() decorator providing metadata
@Injectable({
  // register a provider to make Service available to the DI system
  // Provider instantiates the HeroService class to provide the service at "root" level
  providedIn: 'root',
})

// HeroService class provides injectable service and can have own dependancies
export class HeroService {
  // url form - :base/:collectionName .
  // base - the resource to which requests are made
  // collectionName is the heroes data object in the in-memory-data-service.ts
  private heroesUrl = 'api/heroes'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    //  "service-in-service" scenario
    private messageService: MessageService
  ) {}

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // send a message when the heroes are fetched
    this.messageService.add(`HeroService: ${message}`);
  }

  /** GET heroes from the server */
  // get() call returns an Observable<Hero[]> - "an observable of hero arrays"
  getHeroes(): Observable<Hero[]> {
    // HttpClient methods return an RxJS Observable, a single value
    // applying the type specifier - <Hero[]> otherwise the response is an untyped JSON object by default
    return (
      this.http
        .get<Hero[]>(this.heroesUrl)
        // Pipe(func1,func2,func3,..) let you combine multiple functions into a single function
        .pipe(
          // tap() operator looks at the observable values, does something with those values, and passes them along
          tap((_) => this.log('fetched heroes')),
          // catchError() operator intercepts an Observable that failed.
          // catchError(this.handleError<Hero[]>('getHeroes', []))
          catchError(this.handleError('getHeroes', []))
        )
    );
  }

  getHero(id: number): Observable<Hero> {
    // construct a request URL with the desired hero's id
    const url = `${this.heroesUrl}/${id}`;
    // server responds with a single hero
    // returns an Observable<Hero> ("an observable of Hero objects")
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    // put takes 3 parameters: URL, data to update, options
    // heroes web API knows which hero to update by looking at the hero's id
    return this.http
      .put(this.heroesUrl, hero, this.httpOptions) //web API expects a special header in HTTP save requests
      .pipe(
        tap((newHero: Hero) =>
          this.log(`updated hero id=${hero.id}, hero w/ new name ${hero.name}`)
        ),
        // Return the product on an update
        map(() => hero),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    // expects the server to generate an id for the new hero
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    // don't send data
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found heroes matching "${term}"`)
          : this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      // return of(result as T);
      return throwError(error.body.error);
    };
  }
}
