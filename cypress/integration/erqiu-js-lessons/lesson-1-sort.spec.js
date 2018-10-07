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

        selectSpeed('fastest')
    })

    it('sorts correctly', () => {
        cy.get('#lesson-1-sort-container')
            .should('exist')

        verifyArrayNumbers()

        let numbersAfterRandomization
        accum(findArrayItemNumbers, clickRandomizeButton, findArrayItemNumbers)
            .then(([numbersBefore, _, numbersAfter]) => {
                numbersAfterRandomization = numbersAfter
                expect(numbersBefore).to.not.deep.equal(numbersAfter)
            })

        startAlgorithm()
        waitAlgorithmComplete()
        verifySorted()

        cy.log('After resetting, all numbers are in the same order as initial')
        cy.get('button').contains('Reset').click()
        waitAlgorithmStatus('initial')
        findArrayItemNumbers().then((numbers) => {
            expect(numbers).to.deep.equal(numbersAfterRandomization)
        })
    })

    it('pause/resume works', () => {
        selectSpeed('fast')
        startAlgorithm()
        cy.wait(1000)

        accum(
            findArrayItemNumbers,
            () => cy.wait(1000).get('button').contains('Pause').click(),
            () => waitAlgorithmStatus('paused'),
            () => cy.wait(1000),
            findArrayItemNumbers
        ).then(([numbersBefore, _1, _2, _3, numbersAfter]) => {
            expect(numbersBefore).to.not.deep.equal(numbersAfter)
        })

        selectSpeed('fastest')
        cy.get('button').contains('Resume').click()
        waitAlgorithmComplete()
        verifySorted()
    })

    it('can generate distinct number sequence', () => {
        cy.get('label').contains('Allow Duplicate Number').children().first().click()
        clickRandomizeButton()
        findArrayItemNumbers().then(numbers => {
            const setOfNumbers = new Set(numbers)
            // no duplicate numbers
            expect(numbers).to.have.lengthOf(setOfNumbers.size)
        })
    })
})

function clickRandomizeButton() {
    return cy.get('button').contains('Randomize').click()
}

function verifySorted() {
    return findArrayItemNumbers().then((numbers) => {
        numbers.forEach((num, index) => {
            if (index > 0) {
                expect(numbers[index - 1]).lte(num, 'adjacent pairs should be in order')
            }
        })
    })
}

function selectSpeed(speed = 'normal') {
    return cy.get('label').contains('Speed:')
        .children().first()
        .select(speed)
}

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
    return findArrayItemNumbers().then(numbers => {
        expect(numbers).length.lessThan(15)
        expect(numbers).length.greaterThan(4)
        numbers.forEach((number, index) => {
            expect(number, `number at ${index}`).to.not.be.NaN
        })
    })
}

function startAlgorithm() {
    return cy.get('button').contains('Start')
        .click()
}

function waitAlgorithmComplete() {
    return waitAlgorithmStatus('complete')
}

function waitAlgorithmStatus(goalStatus) {
    return cy.get('h4').contains(`Status: ${goalStatus}`)
}