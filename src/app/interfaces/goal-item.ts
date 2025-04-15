import { Auditor } from "./auditor"
import { GoalFile } from "./goal-file"

export interface AuditItemType {
    id: string
    auditor: Auditor
    code: string
    name: string,
    type: string
    auditItem: AuditItem[]
    files: GoalFile[]
    description?: string
}

export interface AuditItem {
    id?: string
    name: string
    type: string
    description: string
}

export interface ItemType {
    name: string
    codeSize: number
}
