import { NgModule } from '@angular/core';
// to use RouterLink, .forRoot(), and .forChild()
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/heroes', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: '**', component: PageNotFoundComponent },
];

// metadata initializes the router and starts listening for browser location changes
@NgModule({
  // forRoot() configures the router at the application's root level.
  // forRoot() method supplies the service providers
  // and directives needed for routing, and performs the initial navigation
  // based on the current browser URL.
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
