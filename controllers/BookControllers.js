class BookController {
	bookService

	constructor({ bookService }) {
		this.bookService = bookService
	}

	readAllExistingBooks() {
		return async (req, res, next) => {
			try {

				// Find all existing books service
				const existingBooks = await this.bookService.readAllExistingBooks()

				// HTTP Response 200
				res.status(200).json({
					code: 200,
					status: 'OK',
					data: existingBooks
				})
			} catch (err) {
				console.log(err)
				next(err)
			}
		}
	}
}

module.exports = BookController