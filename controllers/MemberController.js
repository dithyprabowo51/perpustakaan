class MemberController {
	memberService

	constructor({ memberService }) {
		this.memberService = memberService
	}

	readAllMembers() {
		return async (req, res, next) => {
			try {

				// Read all members service
				const members = await this.memberService.readAllMembers()

				// HTTP Response 200
				res.status(200).json({
					code: 200,
					status: 'OK',
					data: members
				})
			} catch (err) {
				next(err)
			}
		}
	}

	borrowBooks() {
		return async (req, res, next) => {
			try {

				// Books code
				const { bookCode, memberCode } = req.body

				// Borrow books service
				const borrowBooksResult = await this.memberService.borrowBooks({ bookCode, memberCode })

				res.status(200).json({
					code: 200,
					status: 'OK',
					data: borrowBooksResult
				})

			} catch (err) {
				console.log(err)
				next(err)
			}
		}
	}
}

module.exports = MemberController