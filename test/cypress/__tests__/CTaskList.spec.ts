import { mount } from '@cypress/vue'
import { DateTime } from 'luxon'
import CTaskList from 'src/components/tasks/CTaskList.vue'
import { TaskRepoKey, TaskRepo } from 'src/services/abstracts/task-repo.service'
import { createI18n } from 'vue-i18n'
import { ref } from 'vue'
import { Task } from 'src/typings/task.interface'
import { range } from 'lodash'

const snapshotDt = DateTime.fromISO('2022-01-01')

const taskTemplate: Omit<Task, 'id' | 'title'> = {
  carryOverUntil: snapshotDt,
  dueDt: snapshotDt,
  createDt: snapshotDt,
  lastUpdateDt: snapshotDt,
  priority: 0,
  notes: null,
  completeDt: null,
}

const mockData: Task[] = range(0, 10).map((rangeNo) => {
  return {
    ...taskTemplate,
    id: String(rangeNo),
    title: `mock item #${rangeNo}`,
  }
})

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
      snapshotDt,
    },

    global: {
      plugins: [createI18n()],
      provide: {
        // originally of type InjectionKey
        [TaskRepoKey as symbol]: mockRepo,
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
