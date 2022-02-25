export type CarryOver = 'INDEFINITE' | Date | null

export interface EditableTaskAttrs {
  title: string
  notes: string | null
  priority: number
  targetDt: Date
  carryOverUntil: CarryOver

  completeDt: Date | null
}

export interface Task extends EditableTaskAttrs {
  id: string
  createDt: Date
  lastUpdateDt: Date
}
