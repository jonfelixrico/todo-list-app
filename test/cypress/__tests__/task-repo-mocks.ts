import { range } from 'lodash'
import { DateTime } from 'luxon'
import { TaskRepo } from 'src/services/abstracts/task-repo.service'
import { Task } from 'src/typings/task.interface'
import { ref } from 'vue'

const mockDt = DateTime.fromISO('2022-01-01')

const taskTemplate: Omit<Task, 'id' | 'title'> = {
  carryOverUntil: mockDt,
  dueDt: mockDt,
  createDt: mockDt,
  lastUpdateDt: mockDt,
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

export const mockTaskRepo: TaskRepo = {
  // This is the only method that matters in this unit test
  getTasks: cy.stub().resolves(mockData),
  insert: cy.stub(),
  lastWrite: ref(DateTime.now()),
  remove: cy.stub(),
}
