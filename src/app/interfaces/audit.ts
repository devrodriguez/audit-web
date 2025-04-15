import { Enterprise } from "./enterprise";
import { Finding } from "./finding";
import { AuditItemType } from "./goal-item";
import { AuditType } from "./auditType";
export interface Audit {
    id: string
    description: string
    status: string
    createdAt: number
    completedAt?: number
    enterprise?: Enterprise
    auditType?: AuditType 
    goalItems: AuditItemType[]
    findings?: Finding[]
}
