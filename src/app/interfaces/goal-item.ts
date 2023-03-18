export interface GoalItem {
    id: string
    code?: string
    name: string,
    type?: ItemType
    description?: string
}

export interface ItemType {
    name: string
    codeSize: number
}
