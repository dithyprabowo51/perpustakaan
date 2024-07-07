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


				resolve(findBook)
			} catch (err) {
				reject(err)
			}
		})
	}
}

module.exports = MemberService