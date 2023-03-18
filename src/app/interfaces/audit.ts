import { Enterprise } from "./enterprise";
import { Finding } from "./finding";
import { GoalItem } from "./goal-item";

export interface Audit {
    id: string
    description: string
    status: string
    createdAt: string
    enterprise?: Enterprise
    goalItems: GoalItem[]
    findings?: Finding[]
}
