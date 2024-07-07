const { Op } = require('sequelize')

class MemberRepository {
	Member
	Book
	MemberPenalty

	constructor({ Member, Book, MemberPenalty }) {
		this.Member = Member
		this.Book = Book
		this.MemberPenalty = MemberPenalty
	}

	findAllMembers() {
		return new Promise(async (resolve, reject) => {
			try {
				const findMembers = await this.Member.findAll({
					include: [
						{
							model: this.Book,
							as: 'BorrowedBooks',
							attributes: ['code', 'title', 'author']
						}
					]
				})

				resolve(findMembers.map(memberItem => memberItem.dataValues))
			} catch (err) {
				reject(err)
			}
		})
	}

	findMemberByCode(code) {
		return new Promise(async (resolve, reject) => {
			try {
				const findMember = await this.Member.findOne({
					where: {
						code
					},
					include: [
						{
							model: this.Book,
							as: 'BorrowedBooks',
							attributes: ['code', 'title', 'author']
						}
					]
				})

				resolve(findMember ? findMember.dataValues : findMember)
			} catch (err) {
				reject(err)
			}
		})
	}

	findMemberPenalties(memberId) {
		return new Promise(async (resolve, reject) => {
			try {
				const now = new Date().getTime()
				const limitInMill = now - (3600 * 1000 * 24 * 3)

				const findMemberPenalties = await this.MemberPenalty.findAll({
					where: {
						MemberId: memberId,
						created_at: {
							[Op.gte]: limitInMill
						}
					},
				})

				resolve(findMemberPenalties.map(memberPenaltyItem => memberPenaltyItem.dataValues))
			} catch (err) {
				reject(err)
			}
		})
	}

	createMemberPenalty(memberId) {
		return new Promise(async (resolve, reject) => {
			try {
				const newMemberPenalty = await this.MemberPenalty.create({
					MemberId: memberId
				})

				resolve(newMemberPenalty)
			} catch (err) {
				reject(err)
			}
		})
	}
}

module.exports = MemberRepository