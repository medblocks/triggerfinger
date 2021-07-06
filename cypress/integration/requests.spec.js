describe('it makes requests', () => {
    const compositions = require('../../comp.json')
    const baseTemplateUrl = "http://localhost:5001/ehrbase/rest";
    let templateId
    let ehrId
    before(() => {
        cy.task('getTemplate').then(template => {
            cy.request({
                url: `${baseTemplateUrl}/openehr/v1/definition/template/adl1.4`,
                method: 'POST',
                body: template,
                headers: {
                    'Content-Type': 'application/xml'
                }
            }).then(r => console.log(r))
            
        })
    })
    compositions.slice().reverse().forEach((c, i) => {
        it(`composition ${i + 1}`, () => {
            //  > 12
            let body
            body = {
                ...c,
                "vital_signs/vital_signs:0/blood_pressure:0/a24_hour_average/width":
                    "P1DT12H43M"
            }

            cy.log(body)
            cy.request({
                method: "POST",
                url: `${baseTemplateUrl}ecis/v1/composition`,
                body,
                qs: { templateId, ehrId, format: 'FLAT' },
                timeout: 3000
            })
        })
    })
})