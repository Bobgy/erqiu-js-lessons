/// <reference types="Cypress" />

function arrayItemNumbersShould(assertFn) {
    return cy.get('.array-item-number')
        .should(($numbers) => {
            const texts = $numbers.map((i, el) => Cypress.$(el).text()).get()
            assertFn(texts)
        })
}

context('lesson-1-sort', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        
        cy.get('button').contains('Using erqiu\'s algorithm')
            .click()
            .get('button').contains('Using yuan\'s algorithm')
            .should('exist')
        
        cy.get('label').contains('Speed:')
            .children().first()
            .select('fastest')
    })

    it('sorts correctly', () => {
        cy.get('#lesson-1-sort-container')
            .should('exist')
        
        arrayItemNumbersShould((texts) => {
            expect(texts).length.lessThan(15)
            expect(texts).length.greaterThan(4)
            texts.forEach((text) => {
                expect(Number(text), `number parsed from "${text}"`).to.not.be.NaN
            })
        })

        cy.get('button').contains('Start')
            .click()

        cy.get('h4').contains('Status: complete')
        arrayItemNumbersShould((texts) => {
            const arrayOfNumbers = texts.map(text => Number(text))
            arrayOfNumbers.forEach((num, index) => {
                if (index > 0) {
                    expect(arrayOfNumbers[index - 1]).lte(num, 'adjacent pairs should be in order')
                }
            })
        })
    })
})
