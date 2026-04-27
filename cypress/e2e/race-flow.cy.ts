/// <reference types="cypress" />

const ROUND_FINISH_TIMEOUT = 35_000
const FULL_RACE_TIMEOUT = 40_000

describe('Horse Racing', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('locale', 'en')
      },
    })
  })

  describe('initial page load', () => {
    it('shows the header and four empty-state sections', () => {
      cy.contains('h1', 'Horse Racing').should('be.visible')
      cy.contains('button', 'Generate Race').should('be.enabled')

      cy.contains('No horses found.').should('be.visible')
      cy.contains('No race in progress.').should('be.visible')
      cy.contains('No race program found.').should('be.visible')
      cy.contains('No results found.').should('be.visible')

      cy.get('.race-program__round').should('have.length', 0)
      cy.get('.results__round').should('have.length', 0)
    })
  })

  describe('generate program', () => {
    it('populates 20 horses, a 6-round program, and the first round on the track', () => {
      cy.contains('button', 'Generate Race').click()

      cy.contains('Horse List (20)').should('be.visible')
      cy.get('.horse-list__item').should('have.length', 20)

      cy.get('.race-program__round').should('have.length', 6)
      cy.contains('.race-program__round-title', '1. Round - 1200m').should('be.visible')
      cy.contains('.race-program__round-title', '6. Round - 2200m').should('be.visible')
      cy.get('.race-program__round').first().find('.race-program__item').should('have.length', 10)

      cy.contains('Round').parent().contains('1 / 6').should('be.visible')
      cy.contains('Distance').parent().contains('1200m').should('be.visible')
      cy.contains('Horses').parent().contains('10 / 10').should('be.visible')

      cy.get('.race-progress .race-lane').should('have.length', 10)
      cy.contains('button', 'Start').should('be.enabled')
    })
  })

  describe('resume and pause', () => {
    it('toggles Start -> Pause -> Resume and reflects state in the header and program', () => {
      cy.contains('button', 'Generate Race').click()
      cy.contains('button', 'Start').click()

      cy.contains('button', 'Pause').should('be.visible')
      cy.contains('button', 'Generate Race').should('be.disabled')
      cy.get('.race-program__round').first().find('.race-program__pulse').should('exist')

      cy.contains('button', 'Pause').click()
      cy.contains('button', 'Resume').should('be.visible')
      cy.contains('button', 'Generate Race').should('be.enabled')
      cy.get('.race-program__round').first().find('.race-program__pulse').should('not.exist')

      cy.contains('button', 'Resume').click()
      cy.contains('button', 'Pause').should('be.visible')
      cy.get('.race-program__round').first().find('.race-program__pulse').should('exist')
    })
  })

  describe('race completion', () => {
    it('finishes round 1, populates Results, and advances to round 2 via Next Round', () => {
      cy.contains('button', 'Generate Race').click()
      cy.contains('button', 'Start').click()

      cy.contains('button', 'Next Round', { timeout: ROUND_FINISH_TIMEOUT }).should('be.visible')

      cy.get('.results__round').should('have.length', 1)
      cy.get('.results__round')
        .first()
        .within(() => {
          cy.contains('1. Round - 1200m').should('be.visible')
          cy.get('.results__item').should('have.length', 10)
          cy.get('.results__position').first().should('have.text', '1')
        })

      cy.get('.race-program__round').first().should('have.class', 'race-program__round--finished')

      cy.contains('button', 'Next Round').click()

      cy.contains('Round').parent().contains('2 / 6').should('be.visible')
      cy.contains('Distance').parent().contains('1400m').should('be.visible')
      cy.contains('button', 'Pause').should('be.visible')
    })
  })

  describe('regenerate program', () => {
    it('rebuilds rounds and clears the active round when Generate Race is clicked again', () => {
      cy.contains('button', 'Generate Race').click()

      cy.get('.race-program__round')
        .first()
        .invoke('attr', 'data-round-id')
        .should('match', /.+/)
        .then((firstId) => {
          cy.contains('button', 'Generate Race').click()

          cy.get('.race-program__round').should('have.length', 6)
          cy.get('.race-program__round')
            .first()
            .invoke('attr', 'data-round-id')
            .should('not.equal', firstId)

          cy.contains('Round').parent().contains('1 / 6').should('be.visible')
          cy.contains('Distance').parent().contains('1200m').should('be.visible')
          cy.contains('button', 'Start').should('be.visible')
          cy.contains('No results found.').should('be.visible')
        })
    })
  })

  describe('full game flow', () => {
    it('runs all 6 rounds end-to-end and surfaces the Finished state', () => {
      const distances = [1200, 1400, 1600, 1800, 2000, 2200]

      cy.contains('button', 'Generate Race').click()
      cy.contains('button', 'Start').click()

      distances.forEach((distance, index) => {
        const roundNumber = index + 1
        const isLast = roundNumber === distances.length

        cy.contains('Round').parent().contains(`${roundNumber} / 6`).should('be.visible')
        cy.contains('Distance').parent().contains(`${distance}m`).should('be.visible')

        const expectedNextLabel = isLast ? 'Finished' : 'Next Round'
        cy.contains('button', expectedNextLabel, { timeout: FULL_RACE_TIMEOUT }).should(
          'be.visible',
        )

        cy.get('.results__round').should('have.length', roundNumber)
        cy.get('.race-program__round')
          .eq(index)
          .should('have.class', 'race-program__round--finished')

        if (!isLast) {
          cy.contains('button', 'Next Round').click()
          cy.contains('button', 'Pause').should('be.visible')
        }
      })

      cy.contains('button', 'Finished').should('be.disabled')
      cy.get('.race-program__round--finished').should('have.length', 6)
      cy.get('.results__round').should('have.length', 6)
      cy.get('.results__round')
        .first()
        .within(() => {
          cy.contains('6. Round - 2200m').should('be.visible')
          cy.get('.results__item').should('have.length', 10)
        })
    })
  })
})
