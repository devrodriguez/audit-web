export interface Goal {
    id: string
    name: string
    description: string
    law: Law
}

export interface Law {
    articleCode: string
    description: string
}
