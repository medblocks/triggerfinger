/// <reference types="cypress" />
import {
  querySelectorAllDeep,
  querySelectorDeep,
} from "query-selector-shadow-dom";
import { simulationActions } from "../../src/simulate";
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
describe("Generate UI states", () => {
  let templateId;
  before(() => {
    cy.task("getTemplate").then((template: { xml: string; name: string }) => {
      templateId = template.name;
      const baseUrl = Cypress.env("EHRBASE_URL");
      cy.request({
        url: `${baseUrl}/openehr/v1/definition/template/adl1.4`,
        method: "POST",
        body: template.xml,
        headers: {
          "Content-Type": "application/xml",
        },
        failOnStatusCode: false,
      });
    });
  });
  beforeEach(() => {
    cy.visit(`${Cypress.env("VITE_URL")}/#${templateId}`);
  });
  it("Generates all possible states", () => {
    let form;
    let compositions = [];
    cy.get("mb-form")
      .then((a) => {
        form = a[0];
        return a;
      })
      .children()
      .each((el, i) => {
        const e = el[0];
        const type = e.tagName.toLowerCase();
        if (simulationActions[type]) {
          simulationActions[type]["defined"](e);
          console.log(form);
          form.insertContext();
          const data = form.serialize();
          compositions.push(data);
        }
      })
      .then(() => {
        cy.writeFile("mochawesome-report/compositions.json", compositions, "utf-8");
        console.log(compositions);
      });
  });
});
