const router = require("express").Router();
const scheduleController = require("../controllers/scheduleRequest.controller");

router.post("/", scheduleController.createScheduleRequest);

router.get(
  "/student/:studentId",
  scheduleController.listScheduleRequestsByStudentId
);

router.get(
  "/teacher/:teacherId",
  scheduleController.listScheduleRequestsByTeacherId
);

router.put(
  // "/response/:status/:id/:teacherId/:price",
    "/response/:status/:id/:teacherId",

  scheduleController.updateResponseByTeacher
);

module.exports = router;
