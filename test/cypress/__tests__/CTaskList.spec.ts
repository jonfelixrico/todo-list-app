import { mount } from '@cypress/vue'
import { DateTime } from 'luxon'
import CTaskList from 'src/components/tasks/CTaskList.vue'
import { TaskRepoKey, TaskRepo } from 'src/services/abstracts/task-repo.service'
import { createI18n } from 'vue-i18n'
import { ref } from 'vue'
import { Task } from 'src/typings/task.interface'

const mockData: Task[] = []

beforeEach(() => {
  const mockRepo: TaskRepo = {
    // This is the only method that matters in this unit test
    getTasks: cy.stub().resolves(mockData),
    insert: cy.stub(),
    lastWrite: ref(DateTime.now()),
    remove: cy.stub(),
  }

  mount(CTaskList, {
    props: {
      snapshotDt: DateTime.now(),
    },

    global: {
      plugins: [createI18n()],
      provide: {
        // originally of type InjectionKey
        [TaskRepoKey as symbol]: mockRepo,
      },
    },

    shallow: true,
  })
})

describe('CTaskList', () => {
  // TODO change this placeholder
  it('Placeholder', () => {
    cy.dataCy('list-item').should('have.lengthOf.at.least', 1)
  })
})
