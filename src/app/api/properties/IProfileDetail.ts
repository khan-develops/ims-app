export interface IProfileDetail {
    id: string;
    displayName: string;
    userPrincipalName: string;
    department: string;
    role: string;
    permission: string;
    activeStatus: 'ACTIVE' | 'INACTIVE';
}