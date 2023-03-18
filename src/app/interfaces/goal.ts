import { Auditor } from "./auditor"

export interface Goal {
    id: string
    code?: string
    shortDescription: string,
    type?: string
    description?: string
    auditor: Auditor
    children?: Goal[]
}
