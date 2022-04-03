
interface logged {
    status: string,
    token: string,
}

export interface IUser {
    email: string| null;
    password: string | null;
    logged: logged;
}