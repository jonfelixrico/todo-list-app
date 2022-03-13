import { mockDt } from 'app/test/cypress/__tests__/task-repo-mocks'
import { TaskListDateNavigatorComposable } from 'src/composables/task-list-date-navigator.composable'
import { ref } from 'vue'

export function mockTaskListDateNavigator(): TaskListDateNavigatorComposable {
  return {
    routeDate: ref(mockDt),
    setRouteDate: cy.stub(),
  }
}
