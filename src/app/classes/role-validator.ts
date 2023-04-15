import { User } from "../interfaces/user";

export class RoleValidator {
    isAdmin(user: User): boolean {
        return user.role === 'ADMIN'
    }

    isEditor(user: User): boolean {
        return user.role === 'EDITOR'
    } 
}
