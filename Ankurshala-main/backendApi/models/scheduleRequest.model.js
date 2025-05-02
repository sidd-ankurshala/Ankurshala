const mongoose = require("mongoose");

const scheduleRequest = new mongoose.Schema({
  classId:{
    type: mongoose.Types.ObjectId,
    ref: 'class',
  },
  subjectId:{
      type: mongoose.Types.ObjectId,
      ref: 'subject',
  },
  teacherId:{
      type: mongoose.Types.ObjectId,
      ref: 'user',
  },
  rejectedByTeachers:{
    type: [mongoose.Types.ObjectId],
    ref: 'user',
  },
  chapterId:{
      type: mongoose.Types.ObjectId,
      ref: 'chapter',
  },
  topicId: {
    type: mongoose.Types.ObjectId,
    ref: 'topic',
  },
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  acceptanceStatus:{
    type:String,
    enum: ['pending','accepted','rejected'],
    default:'pending',
  },
  scheduleDate:{
    type: Date,
  },
  startTime:{
    type:String,
  },
  duration:{
    type:Number,
  },
  start_url:{
    type:String
  },
  join_url:{
    type:String
  },
  host_id:{
    type:String
  },
  host_email:{
    type:String
  },
  meeting_id:{
    type:String
  },
  meeting_passcode:{
    type:String
  }
  
});

const schedule = mongoose.model("schedule", scheduleRequest);
module.exports = schedule;