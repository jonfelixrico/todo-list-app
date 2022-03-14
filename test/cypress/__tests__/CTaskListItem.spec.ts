import { mount } from '@cypress/vue'
import { DateTime } from 'luxon'
import CTaskListItem from 'src/components/tasks/CTaskListItem.vue'
import { Task } from 'src/typings/task.interface'
import { createI18n } from 'vue-i18n'

describe('CTaskListItem', () => {
  const task: Task = {
    title: 'mock title',
    priority: 0,
    dueDt: DateTime.fromISO('2022-01-03'),
    carryOverUntil: DateTime.fromISO('2022-01-03'),
    createDt: DateTime.fromISO('2022-01-01'),
    lastUpdateDt: DateTime.fromISO('2022-01-01'),
    id: 'fake id',
    notes: null,
    completeDt: null,
  }

  it('should display the task details', () => {
    mount(CTaskListItem, {
      props: {
        task,
      },

      global: {
        plugins: [createI18n()],
      },
    })

    cy.dataCy('title').should('exist').and('not.have.class', 'text-strike')
    cy.dataCy('completed').should('not.exist')

    cy.dataCy('carried-over').should('not.exist')
    cy.dataCy('days-lapsed').should('not.exist')

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
      },
      global: {
        plugins: [createI18n()],
      },
    })

    cy.dataCy('title').should('have.class', 'text-strike')
    cy.dataCy('completed').should('exist')
  })

  it('should show carry over from', () => {
    mount(CTaskListItem, {
      global: {
        plugins: [createI18n()],
      },

      props: {
        task,
        isCarriedOver: true,
      },
    })

    cy.dataCy('carried-over').should('exist')
    cy.dataCy('days-lapsed').should('not.exist')
  })

  it('should show days lapsed', () => {
    mount(CTaskListItem, {
      global: {
        plugins: [createI18n()],
      },

      props: {
        task,
        isCarriedOver: true,
        carryOverReferenceDt: task.carryOverUntil,
      },
    })

    cy.dataCy('carried-over').should('exist')
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
      },
    })

    cy.dataCy('priority').should('exist')
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
      },
    })

    cy.dataCy('notes').should('exist').and('contain.text', notes)
  })

  it('should emit task if show details is clicked', () => {
    mount(CTaskListItem, {
      global: {
        plugins: [createI18n()],
      },

      props: {
        task,
      },
    })

    cy.dataCy('show-details-btn')
      .click()
      .should(() => {
        const emitted = Cypress.vueWrapper.emitted<[Task | undefined]>('click')
        const emission = emitted?.[0]?.[0]
        expect(emission?.id).equals(task.id)
      })
  })
})
