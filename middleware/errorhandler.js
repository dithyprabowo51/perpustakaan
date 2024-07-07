module.exports = (err, req, res, next) => {
	if (err.code === 400) {
		return res.status(400).json({
			code: 400,
			status: 'BAD_REQUEST',
			errors: err.errors
		})
	}

	return res.status(500).json({
		code: 500,
		status: 'INTERNAL_SERVER_ERROR',
		errors: ['please contact the developer']
	})
}