const addContext = require("mochawesome/addContext");
const {templateId, compositions} = require("../../mochawesome-report/compositions.json");
describe(`${templateId} - ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}`, () => {
  const baseUrl = Cypress.env("EHRBASE_URL");
  let ehrId;
  before(() => {
        cy.request({
          url: `${baseUrl}/openehr/v1/ehr`,
          method: "POST",
        })
        .then((r) => {
          const etag = r.headers.etag as string;
          ehrId = etag.replaceAll('"', "");
        });
  });
  beforeEach(() => {
    cy.visit(`${Cypress.env("VITE_URL")}/#${templateId}`);
  });
  compositions.reverse().forEach((c, i) => {
    it(`Composition ${i + 1}`, function () {
      Cypress.once("test:after:run", (test, runnable) => {
        const screenshot = `assets/${Cypress.spec.name}/composition_${
          i + 1
        }.png`;
        addContext(
          { test },
          {
            title: "Form state",
            value: screenshot,
          }
        );
        addContext(
          { test },
          {
            title: `Template`,
            value: templateId,
          }
        );
        addContext(
          { test },
          {
            title: `Composition`,
            value: JSON.stringify(c, null, 2),
          }
        );
      });
      let body = c;
      cy.log(body);
      const screenshot = `composition_${i + 1}`;
      cy.get("mb-form")
        .then((a) => {
          const form = a[0] as any;
          form.import(c);
          return a;
        })
        .screenshot(screenshot)
        .request({
          method: "POST",
          url: `${baseUrl}/ecis/v1/composition`,
          body,
          qs: { templateId, ehrId, format: "FLAT" },
          timeout: 5000,
        });
    });
  });
});
