import { mount } from '@cypress/vue'
import { date } from 'quasar'
import CTaskListItem from 'src/components/tasks/CTaskListItem.vue'
import { PresentationTask } from 'src/components/tasks/task-list-item.types'
import { createI18n } from 'vue-i18n'

describe('QuasarTooltip', () => {
  const dueDt = date.startOfDate(new Date(), 'day')
  const now = new Date()

  const task: PresentationTask = {
    title: 'mock title',
    priority: 0,
    carryOverUntil: dueDt,
    dueDt,
    createDt: now,
    lastUpdateDt: now,
    id: 'fake id',
    notes: null,
    completeDt: null,
  }

  it('should indicate completion', () => {
    mount(CTaskListItem, {
      props: {
        task: {
          ...task,
          completeDt: new Date(),
        } as PresentationTask,
      },
      global: {
        plugins: [createI18n()],
      },
    })

    cy.dataCy('title').should('have.class', 'text-strike')
    cy.dataCy('completed').should('exist')
  })

  it('should show carry over badge', () => {
    mount(CTaskListItem, {
      global: {
        plugins: [createI18n()],
      },

      props: {
        task: {
          ...task,
          isCarriedOver: true,
        } as PresentationTask,
      },
    })

    cy.dataCy('carry-over').should('exist')
  })

  it('should show priority badge', () => {
    const priority = 10

    mount(CTaskListItem, {
      global: {
        plugins: [createI18n()],
      },

      props: {
        task: {
          ...task,
          priority,
        } as PresentationTask,
      },
    })

    cy.dataCy('priority').should('exist').and('contain.text', priority)
  })

  it('should have a notes section', () => {
    const notes = 'this is a note'
    mount(CTaskListItem, {
      global: {
        plugins: [createI18n()],
      },

      props: {
        task: {
          ...task,
          notes,
        } as PresentationTask,
      },
    })

    cy.dataCy('notes').should('exist').and('contain.text', notes)
  })

  it('should emit task if button is clicked', () => {
    mount(CTaskListItem, {
      global: {
        plugins: [createI18n()],
      },

      props: {
        task,
      },
    })

    cy.dataCy('button')
      .click()
      .should(() => {
        expect(Cypress.vueWrapper.emitted('click')).to.have.lengthOf(1)
      })
  })
})
