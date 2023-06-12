export type Role = 'AUDITOR' | 'ADMIN'

export interface AppUser {
    uid: string
    email: string
    displayName?: string
    emailVerified: boolean
    password?: string
    photoURL?: string
    role: Role
}
