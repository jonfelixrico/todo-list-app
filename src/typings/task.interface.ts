export interface EditableTaskAttrs {
  title: string
  notes: string | null
  priority: number
  dueDt: Date
  carryOverUntil: Date

  completeDt: Date | null
}

export interface Task extends EditableTaskAttrs {
  id: string
  createDt: Date
  lastUpdateDt: Date
}

export type DraftTaskData = Omit<EditableTaskAttrs, 'completeDt'>
