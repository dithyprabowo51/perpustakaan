class MemberService {
	memberRepository
	bookRepository

	constructor({ memberRepository, bookRepository }) {
		this.memberRepository = memberRepository
		this.bookRepository = bookRepository
	}

	readAllMembers() {
		return new Promise(async (resolve, reject) => {
			try {
				const members = await this.memberRepository.findAllMembers()

				const memberMaps = members.map(memberItem => {
					return {
						code: memberItem.code,
						name: memberItem.name,
						BorrowedBooks: memberItem.BorrowedBooks.map(borrowedBookItem => {
							return {
								code: borrowedBookItem.code,
								title: borrowedBookItem.title,
								author: borrowedBookItem.author,
							}
						}),
					}
				})

				resolve(memberMaps)
			} catch (err) {
				reject(err)
			}
		})
	}

	borrowBooks({ bookCode, memberCode }) {
		return new Promise(async (resolve, reject) => {
			try {
				let errors = {}
				let isAnyError = false

				// Find book in database
				const findBook = await this.bookRepository.findBookByCode(bookCode)
				if (!findBook) {
					isAnyError = true
					if (!errors?.bookCode) {
						errors.bookCode = []
					}
					errors.bookCode.push(`book ${bookCode} is not found`)
				}
				if (findBook && findBook.available_quantity < 1) {
					isAnyError = true
					if (!errors?.bookCode) {
						errors.bookCode = []
					}
					errors.bookCode.push(`book ${bookCode} is not available`)
				}

				// Find Member
				const findMember = await this.memberRepository.findMemberByCode(memberCode)
				if (!findMember) {
					isAnyError = true
					if (!errors?.memberCode) {
						errors.memberCode = []
					}
					errors.memberCode.push(`member ${memberCode} is not found`)
				}
				if (findMember && findMember.BorrowedBooks.length > 1) {
					isAnyError = true
					if (!errors?.memberCode) {
						errors.memberCode = []
					}
					errors.memberCode.push(`member has maximum borrowed book`)
				}

				// Find member penalties
				const findMemberPenalties = await this.memberRepository.findMemberPenalties(findMember.id)
				if (findMemberPenalties.length > 0) {
					isAnyError = true
					if (!errors?.memberCode) {
						errors.memberCode = []
					}
					errors.memberCode.push(`member ${memberCode} is currently being penalized`)
				}

				if (isAnyError) throw { code: 400, errors }

				// Update available quantity book
				await this.bookRepository.updateBook(findBook.id, { available_quantity: Number(findBook.available_quantity) - 1 })

				// Create borrowed books
				const newBorrowedBooks = await this.bookRepository.addBorrowedBooks({
					bookId: findBook.id,
					memberId: findMember.id
				})

				resolve(newBorrowedBooks)
			} catch (err) {
				reject(err)
			}
		})
	}

	returnBook({ bookCode, memberCode }) {
		return new Promise(async (resolve, reject) => {
			try {
				const now = new Date().getTime()

				// Find book in database
				const findBook = await this.bookRepository.findBookByCode(bookCode)

				// Find Member
				const findMember = await this.memberRepository.findMemberByCode(memberCode)

				// Find borrowed book
				const findBorrowedBook = await this.bookRepository.readBorrowedBook({ bookId: findBook.id, memberId: findMember.id })
				if (!findBorrowedBook) throw { code: 400, errors: [`you are not borrow book ${findBook.code}`] }

				// Check for penalty
				let isPenalty = false
				const borrowedBookTimePlusSevenDay = (Number(findBorrowedBook.created_at)) + (3600 * 1000 * 24 * 7)
				if (now >= borrowedBookTimePlusSevenDay) {
					isPenalty = true

					await this.memberRepository.createMemberPenalty(findMember.id)
				}

				// Deleted borrowed book
				console.log(findBorrowedBook)
				await this.bookRepository.deleteBorrowedBook(findBorrowedBook.id)

				// Update available quantity book
				await this.bookRepository.updateBook(findBook.id, {
					available_quantity: Number(findBook.available_quantity) + 1
				})

				resolve({
					BookId: findBorrowedBook.BookId,
					MemberId: findBorrowedBook.MemberId,
					penalty: isPenalty
				})
			} catch (err) {
				reject(err)
			}
		})
	}
}

module.exports = MemberService