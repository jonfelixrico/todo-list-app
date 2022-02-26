/** @deprecated */
export type CarryOver = 'INDEFINITE' | Date | null

export interface EditableTaskAttrs {
  title: string
  notes: string | null
  priority: number
  dueDt: Date
  carryOverUntil: CarryOver

  completeDt: Date | null
}

export interface Task extends EditableTaskAttrs {
  id: string
  createDt: Date
  lastUpdateDt: Date
}

export type DraftTaskData = Omit<EditableTaskAttrs, 'completeDt'>
