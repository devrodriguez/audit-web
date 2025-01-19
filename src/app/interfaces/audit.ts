import { Enterprise } from "./enterprise";
import { Finding } from "./finding";
import { AuditItemType } from "./goal-item";

export interface Audit {
    id: string
    description: string
    status: string
    createdAt: string
    enterprise?: Enterprise
    goalItems: AuditItemType[]
    findings?: Finding[]
}
