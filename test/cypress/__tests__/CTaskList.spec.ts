import { mount } from '@cypress/vue'
import CTaskList from 'src/components/tasks/CTaskList.vue'
import { TaskRepoKey } from 'src/services/abstracts/task-repo.service'
import { createI18n } from 'vue-i18n'
import {
  mockDt,
  mockTaskRepo,
} from 'app/test/cypress/__tests__/task-repo-mocks'

const snapshotDt = mockDt

beforeEach(() => {
  mount(CTaskList, {
    props: {
      snapshotDt,
    },

    global: {
      plugins: [createI18n()],
      provide: {
        // originally of type InjectionKey
        [TaskRepoKey as symbol]: mockTaskRepo,
      },
    },
  })
})

describe('CTaskList', () => {
  // TODO change this placeholder
  it('should render the same amount of items that getTasks yield', () => {
    cy.dataCy('list-item').should('have.lengthOf', 10)
  })
})
