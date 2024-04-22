const { ObjectId } = require("mongodb");
const PublishingCompany = require("./publishingCompany.service");
class BookService {
    constructor(client) {
        this.Book = client.db().collection("books");
        this.publishingCompany = new PublishingCompany(client);
    }

    async extractConactData(payload) {
        const publishingCompany = await this.publishingCompany.findById(
            payload.companyId
        );
        const book = {
            title: payload.title,
            price: payload.price,
            quantity: payload.quantity,
            imageUrl: payload.imageUrl,
            publishingCompany: publishingCompany._id,
            publishingYear: payload.publishingYear
                ? payload.publishingYear
                : new Date().getFullYear(),
        };
        Object.keys(book).forEach(
            (key) => book[key] === undefined && delete book[key]
        );
        return book;
    }
    async create(payload) {
        const book = await this.extractConactData(payload);
        const result = await this.Book.findOneAndUpdate(
            book,
            { $set: book },
            {
                returnDocument: "after",
                upsert: true,
            }
        );
        return result;
    }
    async find(filter) {
        const cursor = await this.Book.find(filter);
        const books = await cursor.toArray();

        for (let book of books) {
            book.publishingCompany = await this.publishingCompany.findById(
                book.publishingCompany
            );
        }

        return books;
    }
    async findNew(size) {
        const cursor = await this.Book.find()
            .sort({ publishingYear: -1 })
            .limit(Number.parseInt(size));

        const books = await cursor.toArray();

        for (let book of books) {
            book.publishingCompany = await this.publishingCompany.findById(
                book.publishingCompany
            );
        }

        return books;
    }

    async findById(id) {
        const book = await this.Book.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });

        if (book) {
            book.publishingCompany = await this.publishingCompany.findById(
                book.publishingCompany
            );
        }

        return book;
    }
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = await this.extractConactData(payload);
        const result = await this.Book.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );

        return result;
    }
    async delete(id) {
        const result = await this.Book.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    async deleteAll() {
        const result = await this.Book.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = BookService;
