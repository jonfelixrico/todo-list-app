import { DateTime } from 'luxon'

export interface EditableTaskAttrs {
  title: string
  notes: string | null
  priority: number
  dueDt: DateTime
  carryOverUntil: DateTime

  completeDt: Date | null
}

export interface Task extends EditableTaskAttrs {
  id: string
  createDt: DateTime
  lastUpdateDt: DateTime
}

export type DraftTaskData = Omit<EditableTaskAttrs, 'completeDt'>
