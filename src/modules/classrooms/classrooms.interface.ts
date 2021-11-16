const { ObjectId } = require("mongoose").Types;

export default interface Classroom {
    _id: string;
    name: string;
    auth_id: string;
    description: string;
    participants_id: Array<typeof ObjectId>;
    createTime: Date;
}