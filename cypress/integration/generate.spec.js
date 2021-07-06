/// <reference types="cypress" />
import {
  querySelectorAllDeep,
  querySelectorDeep,
} from "query-selector-shadow-dom";
import { simulationActions } from '../../src/simulate'
// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress
describe('Generate UI states', () => {

  let templateId
  before(() => {
    cy.task('getTemplate').then(detail => {
      templateId = detail.name
    })
  })
  beforeEach(() => {
    cy.visit(`http://localhost:3000/#${templateId}`,
    )
  })
  it('Generates all possible states', () => {
    let form
    let compositions = []
    cy.get('mb-form').then(a => {
      form = a[0]
      return a
    })
      .children().each((el) => {
        const e = el[0]
        const type = e.tagName.toLowerCase()
        if (simulationActions[type]) {
          simulationActions[type]["defined"](e)
          console.log(form)
          form.insertContext()
          const data = form.serialize()
          compositions.push(data)
          cy.log(data)
          // cy.get('@mb-submit').should('be.calledOnce')
        }
      }).then(() => {
        cy.writeFile("comp.json", compositions, 'utf-8')
        console.log(compositions)
      })
  })
})