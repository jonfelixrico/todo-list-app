import { mount } from '@cypress/vue'
import CTaskListItem from 'src/components/tasks/CTaskListItem.vue'
import { Task } from 'src/typings/task.interface'
import { createI18n } from 'vue-i18n'

describe('CTaskListItem', () => {
  const task: Task = {
    title: 'mock title',
    priority: 0,
    dueDt: new Date('2022-01-03'),
    carryOverUntil: new Date('2022-01-03'),
    createDt: new Date('2022-01-01'),
    lastUpdateDt: new Date('2022-01-01'),
    id: 'fake id',
    notes: null,
    completeDt: null,
  }

  const referenceDt = new Date('2022-01-01')

  it('should display the task details', () => {
    mount(CTaskListItem, {
      props: {
        task,
        referenceDt,
      },

      global: {
        plugins: [createI18n()],
      },
    })

    cy.dataCy('title').should('exist').and('not.have.class', 'text-strike')
    cy.dataCy('completed').should('not.exist')
    cy.dataCy('carry-over').should('not.exist')
    cy.dataCy('priority').should('not.exist')
    cy.dataCy('notes').should('not.exist')
  })

  it('should indicate completion', () => {
    mount(CTaskListItem, {
      props: {
        task: {
          ...task,
          completeDt: task.dueDt,
        } as Task,
        referenceDt,
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
        task,
        referenceDt,
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
        } as Task,

        referenceDt,
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
        } as Task,

        referenceDt,
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

        referenceDt,
      },
    })

    cy.dataCy('button')
      .click()
      .should(() => {
        expect(Cypress.vueWrapper.emitted('click')).to.have.lengthOf(1)
      })
  })
})
