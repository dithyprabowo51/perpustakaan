if (process.env.NODE_ENV === 'development') {
	require('dotenv').config()
}

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001
const app = require('./app/app.js')

app.listen(PORT, () => console.log('server is running on port', PORT))