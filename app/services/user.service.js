const { ObjectId } = require("mongodb");

const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }

    async extractConactData(payload) {
        const hashedPassword = await bcrypt.hash(payload.password, saltRounds);
        const user = {
            name: payload.name,
            username: payload.username,
            password: hashedPassword,
            address: payload.address,
            phoneNumber: payload.phoneNumber,
            role: payload.role === "STAFF" ? "STAFF" : "READER",
        };
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );

        return user;
    }
    async create(payload) {
        const user = await this.extractConactData(payload);
        const result = await this.User.findOneAndUpdate(
            user,
            { $set: user },
            {
                returnDocument: "after",
                upsert: true,
            }
        );
        delete result.password;
        return result;
    }
    async findByUsername(username) {
        const user = await this.User.findOne({ username: username });
        return user;
    }
    async findById(id) {
        const user = await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        delete user.password;
        return user;
    }
    async findByUsernameAndPassword(username, password) {
        const user = await this.findByUsername(username);
        if (!user) {
            return null;
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            delete user.password;
            return user;
        } else {
            return null;
        }
    }
}
module.exports = UserService;
