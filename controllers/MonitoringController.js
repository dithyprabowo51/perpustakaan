class MonitoringController {
	sequelize

	constructor({ sequelize }) {
		this.sequelize = sequelize
	}

	healthCheck() {
		return async (req, res, next) => {
			try {
				await this.sequelize.authenticate()

				res.status(200).json({
					code: 200,
					status: 'OK'
				})
			} catch (err) {
				next(err)
			}
		}
	}
}

module.exports = MonitoringController