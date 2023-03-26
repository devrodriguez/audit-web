import { Auditor } from "./auditor"
import { GoalFile } from "./goal-file"

export interface GoalItem {
    id: string
    auditor: Auditor
    code?: string
    name: string,
    type?: ItemType
    files: GoalFile[]
    description?: string
}

export interface ItemType {
    name: string
    codeSize: number
}
