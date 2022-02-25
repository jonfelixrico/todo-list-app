export interface EditableTaskAttrs {
  title: string
  notes: string | null
  priority: number
  targetDt: Date
  carryOverUntil: 'INDEFINITE' | Date | null

  completeDt: Date | null
}

export interface Task extends EditableTaskAttrs {
  id: string
  createDt: Date
  lastUpdateDt: Date
}
