export type Role = 'EDITOR' | 'ADMIN'

export interface User {
    uid: string
    email: string
    displayName?: string
    emailVerified: boolean
    password?: string
    photoURL?: string
    role: Role
}
