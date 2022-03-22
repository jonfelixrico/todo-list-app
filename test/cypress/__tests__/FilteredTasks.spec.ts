import { mount } from '@cypress/vue'
import { mockTaskListDateNavigator } from 'app/test/cypress/__tests__/task-list-date-navigator-mocks'
import { mockTaskRepo } from 'app/test/cypress/__tests__/task-repo-mocks'
import {
  TaskListDateNavigator,
  TaskListDateNavigatorKey,
} from 'src/composables/task-list-date-navigator.composable'
import { TaskRepoKey } from 'src/services/abstracts/task-repo.service'
import { createI18n } from 'vue-i18n'
import FilteredTasks from 'pages/tasks/FilteredTasks.vue'
import LayoutContainer from 'app/test/cypress/wrappers/LayoutContainer.vue'
import { DateTime } from 'luxon'

describe('FilteredTasks', () => {
  let navigator: TaskListDateNavigator

  beforeEach(() => {
    navigator = mockTaskListDateNavigator()
    /*
     * Since FilteredTasks use QPage, it must be wrapped around with a QLayout.
     * This is solved by using LayoutContainer.
     */
    mount(LayoutContainer, {
      global: {
        plugins: [createI18n()],

        provide: {
          [TaskListDateNavigatorKey as symbol]: navigator,
          [TaskRepoKey as symbol]: mockTaskRepo(),
        },

        stubs: {
          // Heavy component; let's not bother rendering it to make the test fast
          CTaskList: true,
        },
      },

      props: {
        component: FilteredTasks,
      },
    })
  })

  it('should have a working prev button', () => {
    const prevDay = DateTime.fromISO('2021-12-31')

    cy.dataCy('prev')
      .should('exist')
      .contains(prevDay.toLocaleString(DateTime.DATE_MED))
      .click()
      .should(() => {
        expect(navigator.setRouteDate).to.be.calledWith(prevDay)
      })
  })

  it('should have a working next button', () => {
    const nextDay = DateTime.fromISO('2022-01-02')

    cy.dataCy('next')
      .should('exist')
      .contains(nextDay.toLocaleString(DateTime.DATE_MED))
      .click()
      .should(() => {
        expect(navigator.setRouteDate).to.be.calledWith(
          DateTime.fromISO('2022-01-02')
        )
      })
  })

  it('should display the current date', () => {
    cy.dataCy('current-date').should(
      'contain.text',
      navigator.routeDate.value?.toLocaleString(DateTime.DATE_MED)
    )
  })
})
