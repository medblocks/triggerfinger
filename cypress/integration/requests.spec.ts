const addContext = require("mochawesome/addContext");

describe("Compositions against EHRbase", () => {
  const compositions = require("../../comp.json");
  const baseTemplateUrl = "http://localhost:5001/ehrbase/rest";
  let templateId;
  let ehrId;
  before(() => {
    cy.task("getTemplate").then((template) => {
      cy.request({
        url: `${baseTemplateUrl}/openehr/v1/definition/template/adl1.4`,
        method: "POST",
        body: template.xml,
        headers: {
          "Content-Type": "application/xml",
        },
        failOnStatusCode: false,
      })
        .then((r) => {
          templateId = template.name;
        })
        .request({
          url: `${baseTemplateUrl}/openehr/v1/ehr`,
          method: "POST",
        })
        .then((r) => {
          ehrId = r.headers.etag.replaceAll('"', "");
        });
    });
  });
  compositions.reverse().forEach((c, i) => {
    it(`Composition ${i + 1}`, function () {
      Cypress.once("test:after:run", (test) => {
        console.log("adding");
        addContext(
          { test },
          {
            title: `Composition ${i + 1}`,
            value: JSON.stringify(c, null, 2),
          }
        );
      });
      let body = c;
      this.c = c;
      cy.log(body);
      cy.request({
        method: "POST",
        url: `${baseTemplateUrl}/ecis/v1/composition`,
        body,
        qs: { templateId, ehrId, format: "FLAT" },
        timeout: 5000,
      });
    });
  });
});
