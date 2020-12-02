import { should } from 'chai';
import { escapeSelector } from 'cypress/types/jquery';
import { watchFile } from 'fs';
import {
  getHeroes,
  getAddHeroButton,
  getNewNameInput,
  getFirstHero,
  getDeleteHeroButton,
  getSecondHero,
  getHeroNameDetail,
  getSaveHeroButton,
  getGoBackButton,
  getLastDashboardHero,
  getNameInputUpdateForm,
  getHeroHeadingDetail,
  getSearchBar,
  getFirstSearchResult,
  getClearMessagesBtn,
} from '../support/app.po';

//describe groups related tests together
describe('angular-tour-of-heroes - Heroes Page', () => {
  //hook runs each time before running  test
  beforeEach(() => cy.visit('http://localhost:4200/heroes'));
  it('should display 10 loaded heroes', () => {
    getHeroes().should((heroeslist) => expect(heroeslist.length).equal(10));
  });
  it('should delete a hero ', () => {
    // getHeroes();
    cy.get('[data-cy=heroListName]').first().as('heroNameList');
    cy.get('@heroNameList')
      .invoke('text')
      .then((heroNameList) => {
        getDeleteHeroButton().click();
        getHeroes().should((heroeslist) => expect(heroeslist.length).equal(9));
        //  ensure the list now doesn't have the deleted name
        getHeroes().should('not.contain', heroNameList);
      });
  });
  it('should not add a new hero with an empty name', () => {
    getNewNameInput().type(' ');
    getAddHeroButton().click();
    getHeroes().should((heroeslist) => expect(heroeslist.length).equal(10));
    // add the error message
  });
  it('should add a new hero with a name', () => {
    getNewNameInput().type('Loius');
    getAddHeroButton().click();
    getHeroes().should((heroeslist) => expect(heroeslist.length).equal(11));
    // ensure the list now includes the newly added  name
    getHeroes().should('contain', 'Loius');
  });
  it('should be able to select a hero, names and ids should match, ', () => {
    cy.get('[data-cy=heroListName]').first().as('heroNameList');
    cy.get('@heroNameList')
      .invoke('text')
      .then((heroNameList) => {
        cy.get('[data-cy=heroListName]').first().click();
        cy.url().should('include', '/detail'); //verify the URL
        getHeroNameDetail();
        // varify name from the list matches name in the detail template
        getHeroNameDetail()
          .invoke('text')
          .should('contain', heroNameList, { matchCase: false });
        //verify id matches the one in the URL
        cy.get('#heroDetailId')
          .invoke('text')
          .then(($heroDetailId) => {
            cy.url().should('contain', $heroDetailId);
          });
      });
  });
  it.only("should correctly update the hero's name", () => {
    // navigate to the first selected hero
    cy.get('[data-cy=heroListName]').first().click();
    // update the Name inside textarea
    cy.get('[data-cy=heroNameFormControl]').as('nameInput').type('EST');
    getSaveHeroButton().click();
    // // verify the updated names match everywhere
    cy.get('@nameInput')
      .invoke('val')
      .then((nameInput) => {
        // verify the updated name matches the one under the name:
        getHeroNameDetail()
          .invoke('text')
          // how to properly ignore case?
          .should('contain', nameInput);
        // verify the updated name matches the one in the details:
        cy.get('[data-cy=heroNameHeading]')
          .invoke('text')
          .should('contain', nameInput);
        // go back and verify the name is updated in the list. List doesn't render properly
        getGoBackButton().click();
        // cy.visit('http://localhost:4200/heroes');
        cy.wait(500); //wait
        cy.get('[data-cy=heroListName]')
          .first()
          .invoke('text')
          .should('contain', nameInput);
      });
  });

  it.only('should clear the HeroService log messages and remove container when the button is clicked', () => {
    getClearMessagesBtn().click();
    // search for a 'HeroService' text that's not supposed to exist
    cy.contains('HeroService').should('not.exist');
    // check that the container is removed
    cy.get('#messages-box').should('not.exist');
  });

  it('should navigate to dashboard view from heroes view', () => {
    cy.contains('Dashboard').click();
    cy.url().should('include', '/dashboard');
  });
});

describe('angular-tour-of-heroes - Heroes Page', () => {
  //   Arrange - setup initial app state
  beforeEach(() => cy.visit('/dashboard'));

  it('should display top 4 loaded heroes', () => {
    getHeroes().should((heroeslist) => expect(heroeslist.length).equal(4));
  });

  it('should navigate to the selected dashboard hero', () => {
    getLastDashboardHero().click();
    // clear and change the name
    getNameInputUpdateForm().clear().as('nameInput').type('Changy'); //give Alias
    // save the updated name
    getSaveHeroButton().click();
    // make sure it gets update in Details and Name:
    cy.get('@nameInput')
      .invoke('val') //get the value of the text area
      .then((nameInput) => {
        getHeroHeadingDetail().invoke('text').should('contain', nameInput);
        getHeroNameDetail().invoke('text').should('contain', nameInput);
        getGoBackButton().click();
        // ensure the list now includes the fully changed name
        getHeroes().should('contain', nameInput);
      });
  });
  // Failing, needs a state
  it('should search for heroes and click on on from the list ', () => {
    getSearchBar().type('Bo');
    cy.wait(1000); //wait for the search-results to appear
    getFirstSearchResult().click();
  });
});
