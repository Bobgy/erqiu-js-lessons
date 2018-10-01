/// <reference types="Cypress" />

const accum = (...cmds) => {
  const results = []

  cmds.forEach((cmd) => {
    cmd().then(results.push.bind(results))
  })

  return cy.wrap(results)
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

        verifyArrayNumbers()
        const cmdClickRandomize = () => cy.get('button').contains('Randomize').click()

        accum(findArrayItemNumbers, cmdClickRandomize, findArrayItemNumbers)
            .then(([numbersBefore, _, numbersAfter]) => {
                expect(numbersBefore).to.not.deep.equal(numbersAfter)
            })

        startAlgorithm()

        waitAlgorithmComplete()

        findArrayItemNumbers().then((numbers) => {
            numbers.forEach((num, index) => {
                if (index > 0) {
                    expect(numbers[index - 1]).lte(num, 'adjacent pairs should be in order')
                }
            })
        })
    })

})

function findArrayItemNumbers() {
    return cy.get('.array-item-number')
        .then(($numbers) => {
            const numbers = $numbers.map((i, el) => Cypress.$(el).text()).get()
                .map(Number).slice()
            console.log(numbers)

            return numbers
        })
}

function verifyArrayNumbers() {
    findArrayItemNumbers().then(numbers => {
        expect(numbers).length.lessThan(15)
        expect(numbers).length.greaterThan(4)
        numbers.forEach((number, index) => {
            expect(number, `number at ${index}`).to.not.be.NaN
        })
    })
}

function startAlgorithm() {
    cy.get('button').contains('Start')
        .click()
}

function waitAlgorithmComplete() {
    cy.get('h4').contains('Status: complete')
}
