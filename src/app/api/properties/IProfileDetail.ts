export interface IProfileDetail {
    id: string;
    displayName: string;
    userPrincipalName: string;
    department: string;
    role: string;
    permission: string;
    status: 'ACTIVE' | 'INACTIVE';
}