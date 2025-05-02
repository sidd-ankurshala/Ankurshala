const Schedule = require("../models/scheduleRequest.model");
// const Teacher = require("../models/teacherSchedule.model");
const mongoose = require("mongoose");
const TeacherSchedule = require("../models/teacherSchedule.model");
const { postToWallet } = require("./../Helpers/helper_functions");

const ZOOM_API_URL = 'https://api.zoom.us/v2/users/me/meetings';
const ZOOM_JWT_TOKEN = process.env.ZOOM_JWT_TOKEN; // Load from .env file
const axios = require('axios');


exports.createScheduleRequest = async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;
    // console.log("Received data:", data);
    // return;

    // Convert fields to appropriate types and trim any whitespace
    const newSchedule = new Schedule({
      // classes: mongoose.Types.ObjectId(data.classes.trim()),
      // subject: mongoose.Types.ObjectId(data.subject.trim()),
      // chapter: mongoose.Types.ObjectId(data.chapter.trim()),
      // topic: mongoose.Types.ObjectId(data.topic.trim()),
      // studentId: mongoose.Types.ObjectId(data.studentId.trim()),
      // startTime: data.startTime, // Assuming startTime is already in a valid format
      // duration: parseInt(data.duration, 10),
      // acceptanceStatus: 'pending', // Set default status to pending
      ...data,
    });

    // Save the new schedule to the database
    await newSchedule.save();
    console.log("newSchedule", newSchedule);

    // if (newSchedule) {
    //   const postWallet = await postToWallet(
    //     "transactions/createAndUpdateWallet",
    //     {
    //       fromUserId: data.studentId,
    //       appId: "ankurshala",
    //       type: "primary",
    //       status: "Success",
    //       amount: -data.price,
    //       metadata: {
    //         orderId: "",
    //         orderType: "topic deduct",
    //         fees: 0,
    //         taxValue: 0,
    //       },
    //     }
    //   );
    // }

    // Find teachers with a matching subject ID
    // const teachers = await TeacherSchedule.find({ subjects: { $in: [data.subjectId] } });

    // Notify matching teachers
    // if (teachers.length > 0) {
    //   teachers.forEach((teacher) => {
    //     console.log(`Notification sent to teacher with ID: ${teacher._id}`);
    //     // Additional notification logic can be placed here
    //   });
    // }

    // Send success response
    res.status(201).json({
      message: "Schedule request created successfully and teachers notified.",
      schedule: newSchedule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating schedule request", error });
  }
};

exports.listScheduleRequestsByStudentId = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    page = page ? parseInt(page, 10) : 1;
    limit = limit ? parseInt(limit, 10) : 10;
    const studentId = req.params.studentId;
    const query = { studentId: mongoose.Types.ObjectId(studentId) };
    console.log(query);
    const scheduleRequests = await Schedule.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "class",
        },
      },
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $lookup: {
          from: "chapters",
          localField: "chapterId",
          foreignField: "_id",
          as: "chapter",
        },
      },
      {
        $lookup: {
          from: "topics",
          localField: "topicId",
          foreignField: "_id",
          as: "topic",
        },
      },
      {
        $unwind: "$class",
      },
      {
        $unwind: "$subject",
      },
      {
        $unwind: "$chapter",
      },
      {
        $unwind: "$topic",
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);

    const resultCount = await Schedule.countDocuments({
      studentId: mongoose.Types.ObjectId(studentId),
    });

    res.status(200).json({
      success: true,
      msg: "List of schedule requests",
      data: scheduleRequests,
      meta: {
        current_page: page,
        from: (page - 1) * limit + 1,
        last_page: Math.ceil(resultCount / limit),
        per_page: limit,
        to: (page - 1) * limit + limit,
        total: resultCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.listScheduleRequestsByTeacherId = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    page = page ? parseInt(page, 10) : 1;
    limit = limit ? parseInt(limit, 10) : 10;
    const teacherId = req.params.teacherId;
    let subjectIds = [];
    const teacherSchedules = await TeacherSchedule.find({
      created_by: mongoose.Types.ObjectId(teacherId),
    });
    teacherSchedules.forEach((teacherSchedule) => {
      subjectIds = [...subjectIds, ...teacherSchedule.subjects];
    });
    console.log(teacherSchedules);
    console.log(subjectIds);
    const query = {
      subjectId: { $in: subjectIds },
      acceptanceStatus: { $in: ["pending", "accepted"] },
      rejectedByTeachers: { $nin: [mongoose.Types.ObjectId(teacherId)] },
    };
    console.log(query);
    const scheduleRequests = await Schedule.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "class",
        },
      },
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $lookup: {
          from: "chapters",
          localField: "chapterId",
          foreignField: "_id",
          as: "chapter",
        },
      },
      {
        $lookup: {
          from: "topics",
          localField: "topicId",
          foreignField: "_id",
          as: "topic",
        },
      },
      {
        $unwind: "$class",
      },
      {
        $unwind: "$subject",
      },
      {
        $unwind: "$chapter",
      },
      {
        $unwind: "$topic",
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);

    const resultCount = await Schedule.countDocuments({
      teacherId: mongoose.Types.ObjectId(teacherId),
    });

    res.status(200).json({
      success: true,
      msg: "List of schedule requests",
      data: scheduleRequests,
      meta: {
        current_page: page,
        from: (page - 1) * limit + 1,
        last_page: Math.ceil(resultCount / limit),
        per_page: limit,
        to: (page - 1) * limit + limit,
        total: resultCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// exports.updateResponseByTeacher = async (req, res, next) => {
//   // router.put('/response/:status/:id/teacherId', scheduleController.updateResponseByTeacher);
//   try {
//     const { status, id, teacherId, price } = req.params;
//     const data = req.body.topicData;
//     // console.log(data.studentId);
//     // return;

//     const query = {
//       _id: mongoose.Types.ObjectId(id),
//     };
//     if (status == "accept") {
//       const data = {
//         acceptanceStatus: "accepted",
//         teacherId: mongoose.Types.ObjectId(teacherId),
//       };

//       const result = await Schedule.updateOne(query, { $set: data });
//       return res.json(result);
//     } else if (status == "reject") {
//       const toPush = {
//         rejectedByTeachers: mongoose.Types.ObjectId(teacherId),
//       };
//       const result = await Schedule.updateOne(query, { $push: toPush });
//       const postWallet = await postToWallet(
//         "transactions/createAndUpdateWallet",
//         {
//           fromUserId: data.studentId,
//           appId: "ankurshala",
//           type: "primary",
//           status: "Refund",
//           amount: price,
//           metadata: {
//             orderId: data._id,
//             orderType: "topic",
//             fees: 0,
//             taxValue: 0,
//           },
//         }
//       );
//       return res.json(result);
//     }
//   } catch (error) {
//     next(error);
//   }
// };



// exports.updateResponseByTeacher = async (req, res, next) => {
//   try {
//     const { status, id, teacherId, price } = req.params;
//     const data = req.body.topicData;
    
//     const query = {
//       _id: mongoose.Types.ObjectId(id),
//     };
//     if (status == "accept") {
//       const updateData = {
//         acceptanceStatus: "accepted",
//         teacherId: mongoose.Types.ObjectId(teacherId),
//       };
//       console.log("==============================>>>>>>",updateData)

//       const result = await Schedule.updateOne(query, { $set: updateData });
      
//       // Schedule Zoom Meeting
//       try {
//         const zoomResponse = await axios.post(ZOOM_API_URL, req.body, {
//           headers: {
//             Authorization: `Bearer ${ZOOM_JWT_TOKEN}`,
//             'Content-Type': 'application/json',
//           }
//         });
//         console.log('Zoom meeting scheduled:', zoomResponse.data);
//         const updateZoomData = {
//                  start_url: zoomResponse.data.start_url,
//                  join_url: zoomResponse.data.join_url,
//                  host_id: zoomResponse.data.host_id,
//                  host_email: zoomResponse.data.host_email,
//              };
//       const result = await Schedule.updateOne(query, { $set: updateZoomData });
//   console.log("$$$$$$$$$##################+++++++++>",result)
//         return res.json({ result, zoomMeeting: zoomResponse.data });
//       } catch (zoomError) {
//         console.error('Error scheduling Zoom meeting:', zoomError.response?.data || zoomError.message);
//         return res.status(zoomError.response?.status || 500).json({
//           error: 'Failed to schedule meeting',
//           details: zoomError.response?.data || zoomError.message
//         });
//       }
//     } else if (status == "reject") {
//       const toPush = {
//         rejectedByTeachers: mongoose.Types.ObjectId(teacherId),
//       };
//       const result = await Schedule.updateOne(query, { $push: toPush });
      
//       // const postWallet = await postToWallet(
//       //   "transactions/createAndUpdateWallet",
//       //   {
//       //     fromUserId: data.studentId,
//       //     appId: "ankurshala",
//       //     type: "primary",
//       //     status: "Refund",
//       //     amount: price,
//       //     metadata: {
//       //       orderId: data._id,
//       //       orderType: "topic",
//       //       fees: 0,
//       //       taxValue: 0,
//       //     },
//       //   }
//       // );
//       return res.json(result);
//     }
//   } catch (error) {
//     next(error);
//   }
// };




const ZOOM_AUTH_URL = "https://zoom.us/oauth/token";
const CLIENT_ID = "SkGP5A_uQiy3UJvklF0hBQ";
const CLIENT_SECRET = "TERf95HSwb5wxOrxoUbYpsqDJp12tonL";
const ACCOUNT_ID = "hIldVle0Qq27MMcfXMtAhA";

const getZoomToken = async () => {
  const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  try {
    const response = await axios.post(
      ZOOM_AUTH_URL,
      "grant_type=account_credentials&account_id=" + ACCOUNT_ID,
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching Zoom token:", error.response?.data || error.message);
    throw new Error("Failed to obtain Zoom token");
  }
};

exports.updateResponseByTeacher = async (req, res, next) => {
  try {
    const { status, id, teacherId } = req.params;

    const query = { _id: mongoose.Types.ObjectId(id) };

    if (status === "accept") {
      const updateData = {
        acceptanceStatus: "accepted",
        teacherId: mongoose.Types.ObjectId(teacherId),
      };

      console.log("Updating Schedule:", updateData);
      await Schedule.updateOne(query, { $set: updateData });

      try {
        const zoomToken = await getZoomToken();
        console.log("Zoom Token:", zoomToken);

        const zoomResponse = await axios.post(
          ZOOM_API_URL,
          req.body,
          {
            headers: {
              Authorization: `Bearer ${zoomToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Zoom Meeting Scheduled:", zoomResponse.data);

        const updateZoomData = {
          start_url: zoomResponse.data.start_url,
          join_url: zoomResponse.data.join_url,
          host_id: zoomResponse.data.host_id,
          host_email: zoomResponse.data.host_email,
          meeting_id: zoomResponse.data.id,
          meeting_passcode: zoomResponse.data.password, 
        };

        await Schedule.updateOne(query, { $set: updateZoomData });

        return res.json({ message: "Meeting Scheduled", zoomMeeting: zoomResponse.data });
      } catch (zoomError) {
        console.error("Error scheduling Zoom meeting:", zoomError.response?.data || zoomError.message);
        return res.status(zoomError.response?.status || 500).json({
          error: "Failed to schedule meeting",
          details: zoomError.response?.data || zoomError.message,
        });
      }
    } else if (status === "reject") {
      const toPush = {
        rejectedByTeachers: mongoose.Types.ObjectId(teacherId),
      };

      await Schedule.updateOne(query, { $push: toPush });

      return res.json({ message: "Request Rejected" });
    }
  } catch (error) {
    next(error);
  }
};


