
const express = require('express')
const router = express.Router()
const Controller = require('../Controllers/Proctoring.controller')

router.post('/create', Controller.create)

router.post('/updateById', Controller.updateById)

router.post('/getList', Controller.getList)

router.post('/getStudentExam', Controller.getStudentExam)

router.post('/getDeletedList', Controller.getDeletedList)

router.post('/getDataById', Controller.getDataById)

router.post('/deleteDataById', Controller.deleteDataById)

router.post('/restoreDataById', Controller.restoreDataById)

router.post('/join-room', Controller.joinRoom)

router.post('/getRecordings', Controller.getRecordings)

module.exports = router