// Resources
const express = require('express')
const cors = require('cors')
const { sequelize, Book, Member, MemberPenalty } = require('../models')
const MonitoringController = require('../controllers/MonitoringController')
const BookController = require('../controllers/BookControllers')
const MemberController = require('../controllers/MemberController')
const BookRepository = require('../repository/bookRepository')
const MemberRepository = require('../repository/memberRepository')
const BookService = require('../service/bookService')
const MemberService = require('../service/memberService')

// Express init
const app = express()

// Cors configuration
app.use(cors())

// Body parser and json
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Repository Instance
const newBookRepository = new BookRepository({ Book })
const newMemberRepository = new MemberRepository({ Member, Book, MemberPenalty })

// Service instance
const newBookService = new BookService({ bookRepository: newBookRepository })
const newMemberService = new MemberService({ memberRepository: newMemberRepository, bookRepository: newBookRepository })

// Controller Instance
const newMonitoringController = new MonitoringController({ sequelize })
const newBookController = new BookController({ bookService: newBookService })
const newMemberController = new MemberController({ memberService: newMemberService })

// Router
app.get('/api/health-checks', newMonitoringController.healthCheck())
app.get('/api/books/existing-books', newBookController.readAllExistingBooks())
app.get('/api/members', newMemberController.readAllMembers())
app.post('/api/members/borrow-books', newMemberController.borrowBooks())

module.exports = app