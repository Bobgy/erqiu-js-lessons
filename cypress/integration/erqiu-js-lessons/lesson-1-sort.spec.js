/// <reference types="Cypress" />

context('lesson-1-sort', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })

    it('works', () => {
        cy.get('#lesson-1-sort-container')
            .should('exist')
        
        cy.get('.array-item-number')
            .should(($numbers) => {
                const texts = $numbers.map((i, el) => Cypress.$(el).text()).get()

                expect(texts).length.lessThan(15)
                expect(texts).length.greaterThan(4)
                texts.forEach((text) => {
                    expect(Number(text), `number parsed from "${text}"`).to.not.be.NaN
                })
            })
    })
})