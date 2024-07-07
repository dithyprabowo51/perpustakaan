const { Op } = require('sequelize')

class BookRepository {
	Book

	constructor({ Book }) {
		this.Book = Book
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
}

module.exports = BookRepository