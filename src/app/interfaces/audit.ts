import { Auditor } from "./auditor";
import { Enterprise } from "./enterprise";
import { Goal } from "./goal";

export interface Audit {
    id: string;
    description: string;
    auditor: Auditor;
    enterprise: Enterprise;
    goals: Goal[]
}
