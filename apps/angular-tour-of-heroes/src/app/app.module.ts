import { BrowserModule } from '@angular/platform-browser'; // to run an app in a browser
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms'; // to build template driven forms
// HttpClient is a mechanism for communicating with a remote server over HTTP
import { HttpClientModule } from '@angular/common/http';
// By using the In-memory Web API, you won't have to set up a server. Install the In-memory Web API package from npm
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppRoutingModule } from './app-routing.module'; // routes configured here

import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';
import { MessagesComponent } from './messages/messages.component';
import { DashboardComponent } from './dashboard/dashboard.component'; // <-- NgModel lives here
import { InMemoryDataService } from './in-memory-data.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { heroReducer } from './heroes/state/hero.reducer';
import { HeroEffects } from './heroes/state/hero.effects';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    DashboardComponent,
    HeroSearchComponent,
    PageNotFoundComponent,
  ],
  //external modules needed for an app
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove for real server.
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false,
    }),
    StoreModule.forRoot({ heroes: heroReducer }),
    EffectsModule.forRoot([HeroEffects]),
    StoreDevtoolsModule.instrument({
      name: 'heroes',
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
