export default interface IUser {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    user_type: number;
    reg_type: number;
    mssv: string;
    avatar: string;
    create_at: Date;
    update_at: Date;
}