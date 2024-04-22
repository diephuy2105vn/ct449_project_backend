const { ObjectId } = require("mongodb");
const BookService = require("./book.service");
const UserService = require("./user.service");
class OrderBookService {
    constructor(client) {
        this.OrderBook = client.db().collection("orderBooks");
        this.bookService = new BookService(client);
        this.userService = new UserService(client);
    }

    async extractConactData(payload) {
        const book = await this.bookService.findById(payload.bookId);
        const user = await this.userService.findById(payload.user._id);
        if (!book) {
            return null;
        }
        const orderBook = {
            book: book,
            user: user._id,
            quantity: payload.quantity,
            borrowedDate: payload.borrowedDate
                ? new Date(payload.borrowedDate)
                : new Date(),
            payDate: new Date(payload.payDate),
        };
        Object.keys(orderBook).forEach(
            (key) => orderBook[key] === undefined && delete orderBook[key]
        );
        return orderBook;
    }
    async create(payload) {
        const orderBook = await this.extractConactData(payload);
        const book = {
            ...orderBook.book,
            companyId: orderBook.book.publishingCompany._id,
            quantity: orderBook.book.quantity - orderBook.quantity,
        };
        const bookUpdated = await this.bookService.update(book._id, book);
        orderBook.book = bookUpdated;
        const result = await this.OrderBook.findOneAndUpdate(
            orderBook,
            { $set: orderBook },
            {
                returnDocument: "after",
                upsert: true,
            }
        );
        return result;
    }
    async find(filter) {
        const cursor = await this.OrderBook.find(filter);
        const orders = await cursor.toArray();
        for (let order of orders) {
            order.user = await this.userService.findById(order.user);
        }
        return orders;
    }
    async findById(id) {
        const order = await this.OrderBook.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        if (order) {
            order.user = await this.userService.findById(order.user);
        }
        return order;
    }
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = await this.extractConactData(payload);
        const result = await this.OrderBook.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.OrderBook.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });

        const book = {
            ...result.book,
            companyId: result.book.publishingCompany,
            quantity: result.book.quantity + result.quantity,
        };
        console.log(book);
        await this.bookService.update(book._id, book);
        return result;
    }
    async deleteAll() {
        const result = await this.OrderBook.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = OrderBookService;
