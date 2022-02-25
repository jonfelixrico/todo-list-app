export interface Task {
  id: string
  title: string
  notes: string | null
  priority: number
  createDt: Date
  lastUpdateDt: Date
}
