// po - stands for Page Object
// helper functions for page object

export const getHeroes = () => cy.get('li.hero');

export const getFirstHero = () => cy.get('ul').first();

export const getSecondHero = () => cy.get('ul>li').eq(1);

export const getHeroNameDetail = () => cy.get('#heroDetailName');

export const getInput = () => cy.get('[data-cy=newHeroName]');

export const getDeleteHeroButton = () => cy.contains('x');

export const getAddHeroButton = () => cy.contains('add');

export const getSaveHeroButton = () => cy.contains('save');

export const getGoBackButton = () => cy.contains('go back');
