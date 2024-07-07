class BookService {
	bookRepository

	constructor({ bookRepository }) {
		this.bookRepository = bookRepository
	}

	readAllExistingBooks() {
		return new Promise(async (resolve, reject) => {
			try {
				const existingBooks = await this.bookRepository.findAllExistingBooks({})

				const existingBooksMap = existingBooks.map(bookItem => {
					return {
						code: bookItem.code,
						title: bookItem.title,
						author: bookItem.author,
						available_quantity: bookItem.available_quantity,
					}
				})

				resolve(existingBooksMap)
			} catch (err) {
				reject(err)
			}
		})
	}
}

module.exports = BookService