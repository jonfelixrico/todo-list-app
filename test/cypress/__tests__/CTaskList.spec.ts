import { mount } from '@cypress/vue'
import CTaskList from 'src/components/tasks/CTaskList.vue'
import { TaskRepoKey } from 'src/services/abstracts/task-repo.service'
import { createI18n } from 'vue-i18n'
import {
  mockDt,
  mockTaskRepo,
  mockTasks,
} from 'app/test/cypress/__tests__/task-repo-mocks'

describe('CTaskList', () => {
  beforeEach(() => {
    mount(CTaskList, {
      props: {
        snapshotDt: mockDt,
      },

      global: {
        plugins: [createI18n()],
        provide: {
          // originally of type InjectionKey
          [TaskRepoKey as symbol]: mockTaskRepo(),
        },
      },
    })
  })

  it('should render the same amount of items that getTasks yield', () => {
    cy.dataCy('list-item').should('have.lengthOf', mockTasks.length)
  })
})
