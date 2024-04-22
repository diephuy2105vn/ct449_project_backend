const { ObjectId } = require("mongodb");
class PublishingCompany {
    constructor(client) {
        this.PublishingCompany = client.db().collection("publishingCompanies");
    }

    extractConactData(payload) {
        const publishingCompany = {
            name: payload.name,
            address: payload.address,
        };
        Object.keys(publishingCompany).forEach(
            (key) =>
                publishingCompany[key] === undefined &&
                delete publishingCompany[key]
        );
        return publishingCompany;
    }
    async create(payload) {
        const publishingCompany = this.extractConactData(payload);
        const result = await this.PublishingCompany.findOneAndUpdate(
            publishingCompany,
            { $set: publishingCompany },
            {
                returnDocument: "after",
                upsert: true,
            }
        );
        return result;
    }
    async find(filter) {
        const cursor = await this.PublishingCompany.find(filter);
        return await cursor.toArray();
    }
    async findById(id) {
        return await this.PublishingCompany.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.PublishingCompany.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.PublishingCompany.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    async deleteAll() {
        const result = await this.PublishingCompany.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = PublishingCompany;
