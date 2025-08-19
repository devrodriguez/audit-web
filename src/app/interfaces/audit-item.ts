import { Auditor } from "./auditor"

export interface AuditItemFile {
    name: string
    fullPath: string
}

export interface AuditItem {
    id?: string
    name: string
    type: string
    description: string
    auditor?: Auditor
    files?: AuditItemFile[] 
}

export interface ItemType {
    name: string
    codeSize: number
}
