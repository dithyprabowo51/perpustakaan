const { Op } = require('sequelize')

class BookRepository {
	Book
	BorrowedBook

	constructor({ Book, BorrowedBook }) {
		this.Book = Book
		this.BorrowedBook = BorrowedBook
	}

	findAllExistingBooks({ codes = null }) {
		return new Promise(async (resolve, reject) => {
			try {
				const filter = {
					available_quantity: {
						[Op.gte]: 1
					},
					code: codes !== null ? {
						[Op.or]: codes
					} : null
				}

				for (let key in filter) {
					if (filter[key] === null) {
						delete filter[key]
					}
				}

				const findBooks = await this.Book.findAll({
					where: filter
				})

				resolve(findBooks.map(bookItem => bookItem.dataValues))
			} catch (err) {
				reject(err)
			}
		})
	}

	findBookByCode(code) {
		return new Promise(async (resolve, reject) => {
			try {

				const findBook = await this.Book.findOne({
					where: {
						code
					}
				})

				resolve(findBook ? findBook.dataValues : findBook)
			} catch (err) {
				reject(err)
			}
		})
	}

	updateBook(id, { title = null, author = null, available_quantity = null }) {
		return new Promise(async (resolve, reject) => {
			try {
				const payload = { title, author, available_quantity }
				for (let key in payload) {
					if (payload[key] === null) {
						delete payload[key]
					}
				}

				await this.Book.update(
					payload,
					{
						where: {
							id
						}
					}
				)

				const updatedBook = await this.Book.findByPk(id)
				resolve(updatedBook.dataValues)
			} catch (err) {
				reject(err)
			}
		})
	}

	addBorrowedBooks({ bookId, memberId }) {
		return new Promise(async (resolve, reject) => {
			try {
				const newBorrowedBook = await this.BorrowedBook.create({
					BookId: bookId,
					MemberId: memberId
				})

				resolve(newBorrowedBook)
			} catch (err) {
				reject(err)
			}
		})
	}

	readBorrowedBook({ bookId, memberId }) {
		return new Promise(async (resolve, reject) => {
			try {
				const findBorrowedBook = await this.BorrowedBook.findOne({
					attributes: ['id', 'BookId', 'MemberId', 'created_at', 'updated_at'],
					where: {
						BookId: bookId,
						MemberId: memberId
					}
				})

				resolve(findBorrowedBook ? findBorrowedBook : null)
			} catch (err) {
				reject(err)
			}
		})
	}

	deleteBorrowedBook(id) {
		return new Promise(async (resolve, reject) => {
			try {
				await this.BorrowedBook.destroy({
					where: {
						id
					}
				})

				resolve(`successfully deleted borrowed book id ${id}`)
			} catch (err) {
				reject(err)
			}
		})
	}
}

module.exports = BookRepository