const createError = require('http-errors')
const Model = require('../Models/Proctoring.model')
const timeTableModel = require('../Models/Timetable.model')
const QuestionMapModel = require('../Models/Question-map.model')
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const { twilioClient, generateAccessToken } = require('../helpers/webrtc')

module.exports = {

  create: async (req, res, next) => {
    try {
      const data = req.body

      const dataExists = await Model.findOne({ user_id: data.user_id, exam_id: data.exam_id, proctor_id: data.proctor_id, is_active: true })
      if (dataExists) {
        return res.send({ success: false, msg: 'Duplicate data' })
      }

      data.created_at = Date.now()
      data.updated_at = Date.now()
      data.created_by = req.user ? req.user.username : 'unauth'
      data.updated_by = req.user ? req.user.username : 'unauth'

      const createdRoom = await twilioClient().video.v1.rooms.create({
        uniqueName: uuidv4(),
        type: "group",
        RecordParticipantsOnConnect: true
      });

      // Convert the Twilio room object to plain JSON
      const sanitizedRoom = JSON.parse(JSON.stringify(createdRoom));

      if (sanitizedRoom) {
        data.proctor_data = sanitizedRoom;
        const model = new Model(data);
        const savedData = await model.save();

        res.send({ success: true, msg: 'Room created successfully', data: savedData });
      } else {
        return res.send({ success: false, msg: 'Failed to create room' });
      }
      // if (createdRoom) {
      //   data.proctor_data = createdRoom
      //   const model = new Model(data)
      //   await model.save()
      //   // const savedModel = await model.save()
      //   if (false && savedModel) {
      //     res.send({ success: true, msg: 'Please wait...' })
      //   } else {
      //     res.send({ success: false, msg: 'Failed to operation.' })
      //   }
      // } else {
      //   return res.send({ success: false, msg: 'Failed to create room' })
      // }
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  updateById: async (req, res, next) => {
    try {
      const data = req.body
      if (!data) {
        return next(createError.NotAcceptable('Invalid Query Data'))
      }
      data.updated_at = Date.now()
      data.updated_by = req.user.username

      let result = {}
      result = await Model.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(data.id) }, data)
      if (result) {
        res.send({ success: true, msg: 'Data Updated Successfully' })
      } else {
        res.send({ success: false, msg: 'Failed to Update Data' })
      }
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Bad Request'))
      next(error)
    }
  },

  getList: async (req, res, next) => {
    try {
      const data = req.body
      let list = []
      list = await Model.find({ is_active: true, ...data }, { __v: 0 })
      if (list) {
        res.send({ success: true, msg: 'Data Fetched', data: list, count: list.length })
      } else {
        res.send({ success: false, msg: 'Failed to Fetch Data' })
      }
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Bad Request'))
      next(error)
    }
  },

  getDeletedList: async (req, res, next) => {
    try {
      let list = []
      list = await Model.find({ is_active: false }, { __v: 0 })
      if (list) {
        res.send({ success: true, msg: 'Data Fetched', data: list, count: list.length })
      } else {
        res.send({ success: false, msg: 'Failed to Fetch Data' })
      }
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Bad Request'))
      next(error)
    }
  },

  getDataById: async (req, res, next) => {
    try {
      const data = req.body
      if (!data) {
        return next(createError.NotAcceptable('Invalid Query Data'))
      }
      let result = {}
      // result = await timeTableModel.findOne({proctor_Id: data.id})
      result = await timeTableModel.aggregate([
        {
          $match: { proctor_Id: mongoose.Types.ObjectId(data.id) }
        },
        {
          $lookup: {
            from: "users",
            localField: "user_Id",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        {
          $unwind: "$userDetails",
        },
        {
          $lookup: {
            from: "catalogs",
            localField: "catalog_Id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            "product.title": 1,
            "exam_date": 1,
            "exam_start_time": 1,
            "product._id": 1,
            "product.product_code": 1,
            "product.area_of_interest": 1,
            "userDetails.name": 1,
            "userDetails._id": 1,
          },
        }
      ]);
      if (result) {
        res.send({ success: true, msg: 'Detail Fetched', data: result, count: result.length })
      } else {
        res.send({ success: false, msg: 'Failed to Fetch Detail' })
      }

    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Bad Request'))
      next(error)
    }
  },

  getStudentExam: async (req, res, next) => {
    try {
      const data = req.body
      if (!data) {
        return next(createError.NotAcceptable('Invalid Query Data'))
      }
      data.updated_at = Date.now()
      data.updated_by = req.user.username

      let timeTable = await timeTableModel.find({
        proctor_Id: req.user.id,
        user_Id: mongoose.Types.ObjectId(data.user_Id),
        product_Id: mongoose.Types.ObjectId(data.paper_code)
      })
      let questionPaper = {}
      questionPaper = await QuestionMapModel.aggregate([
        {
          $match: {
            user_Id: mongoose.Types.ObjectId(data.user_Id),
            paper_code: mongoose.Types.ObjectId(data.paper_code),
          }
        },
        {
          $lookup: {
            from: "users",
            localField: 'user_Id',
            foreignField: '_id',
            as: 'user_Id'
          }
        },
        {
          $unwind: { path: '$user_Id', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'catalogs',
            localField: 'paper_code',
            foreignField: '_id',
            as: 'paper_code'
          }
        },
        {
          $unwind: { path: '$paper_code', preserveNullAndEmptyArrays: true }
        },
      ])
      if (questionPaper) {
        res.send({ success: true, msg: "Data Fetched", data: questionPaper[0], time: timeTable[0] })
      } else {
        res.send({ success: false, msg: "Data not fetched" })
      }
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Bad Request'))
      next(error)
    }
  },

  deleteDataById: async (req, res, next) => {
    try {
      const data = req.body
      if (!data) {
        return next(createError.NotAcceptable('Invalid Query Data'))
      }
      data.updated_at = Date.now()
      data.updated_by = req.user.username

      let result = {}
      result = await Model.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(data.id) }, { $set: { is_active: false } })
      if (result) {
        res.send({ success: true, msg: 'Data Deleted Successfully' })
      } else {
        res.send({ success: false, msg: 'Failed to Delete Data' })
      }
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Bad Request'))
      next(error)
    }
  },

  restoreDataById: async (req, res, next) => {
    try {
      const data = req.body
      if (!data) {
        return next(createError.NotAcceptable('Invalid Query Data'))
      }
      data.updated_at = Date.now()
      data.updated_by = req.user.username

      let result = {}
      result = await Model.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(data.id) }, { $set: { is_active: true } })
      if (result) {
        res.send({ success: true, msg: 'Data Restored Successfully' })
      } else {
        res.send({ success: false, msg: 'Failed to Restore Data' })
      }
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Bad Request'))
      next(error)
    }
  },

  joinRoom: async (req, res) => {
    // return 400 if the request has an empty body or no roomName
    if (!req.body || !req.body.roomName) {
      return res.status(400).send("Must include roomName argument.");
    }
    const roomName = req.body.roomName;
    const identity = req.body.identity;
    // find or create a room with the given roomName
    // findOrCreateRoom(roomName);
    // generate an Access Token for a participant in this room
    const token = generateAccessToken(identity, roomName);
    console.log('Token:', token);
    res.send({
      token: token,
    });
  },
  getRecordings: async (req, res) => {
    // return 400 if the request has an empty body or no roomName
    const { roomSid } = req.body;

    try {
      const recordings = await twilioClient().video.v1.recordings.list({
        groupRoomSid: roomSid
      });

      res.send({ success: true, msg: 'Data', data: recordings });
    } catch (error) {
      console.error('Error fetching recordings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

}