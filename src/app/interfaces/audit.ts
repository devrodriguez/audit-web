import { Enterprise } from "./enterprise";
import { AuditItem } from "./audit-item";
import { AuditType } from "./auditType";

export interface Audit {
    id: string
    description: string
    status: string
    createdAt: number
    completedAt?: number
    enterprise?: Enterprise
    auditType?: AuditType 
    auditItems: AuditItem[]
}
