import { Auditor } from "./auditor";
import { Enterprise } from "./enterprise";
import { Finding } from "./finding";
import { Goal } from "./goal";

export interface Audit {
    id: string
    description: string
    status: string
    createdAt: string
    auditor: Auditor
    enterprise: Enterprise
    goals: Goal[]
    findings?: Finding[]
}
