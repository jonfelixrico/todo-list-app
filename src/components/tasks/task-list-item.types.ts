import { Task } from 'src/typings/task.interface'

export interface PresentationTask extends Task {
  isCarriedOver?: boolean
}
