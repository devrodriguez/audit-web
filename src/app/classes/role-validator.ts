import { AppUser } from "../interfaces/app-user";

export class RoleValidator {
    isAdmin(user: AppUser): boolean {
        return user.role === 'ADMIN'
    }

    isEditor(user: AppUser): boolean {
        return user.role === 'AUDITOR'
    } 
}
