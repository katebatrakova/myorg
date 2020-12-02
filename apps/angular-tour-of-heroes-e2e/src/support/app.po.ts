// po - stands for Page Object
// helper functions for page object

export const getHeroes = () => cy.get('li.hero');

export const getFirstHero = () => cy.get('ul').first();

export const getSecondHero = () => cy.get('ul>li').eq(1);

export const getHeroNameDetail = () => cy.get('#heroDetailName');

export const getNewNameInput = () => cy.get('[data-cy=newHeroName]'); //hero to add

export const getDeleteHeroButton = () => cy.contains('x');

export const getAddHeroButton = () => cy.contains('add');

export const getSaveHeroButton = () => cy.contains('save');

export const getGoBackButton = () => cy.contains('go back');

export const getLastDashboardHero = () => cy.get('ul>li').last();

export const getNameInputUpdateForm = () =>
  cy.get('[data-cy=heroNameFormControl]');

export const getHeroHeadingDetail = () => cy.get('[data-cy=heroNameHeading]');

export const getSearchBar = () => cy.get('#search-box');

export const getFirstSearchResult = () => cy.get('ul.search-result>li').eq(0);

export const getClearMessagesBtn = () => cy.get('button.clear');
