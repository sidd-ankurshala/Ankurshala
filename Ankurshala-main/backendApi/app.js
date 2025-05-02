const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
require("./Helpers/init_mongodb");
// require('./Helpers/init_db_data')
// const socketIo = require('socket.io');
// const io = socketIo(server);
const { Server } = require("socket.io");
require("./Helpers/init_cron");
const cors = require("cors");
const debug = require("debug")(process.env.DEBUG + "server");
const path = require("path");
const compression = require("compression");
const createError = require("http-errors");
const https = require("https");
const fs = require("fs");
const { generateToken } = require("./Helpers/twillio_helper");

const { inNumberArray, isBetween, isRequiredAllOrNone, validateRequest } = require("./Validations/validation");
const { KJUR } = require("jsrsasign");

// const axios = require('axios');

const app = express();

// const server = http.createServer(app);

const options = {
  key: fs.readFileSync("./certs/private-key.pem"),
  cert: fs.readFileSync("./certs/certificate.pem"),
};

// const server = https.createServer(options, app);
const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4043", // Replace with the correct URL of your Angular app
    methods: ["GET", "POST"],
  },
});


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
// Handle socket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for "chatMessage" with additional metadata (e.g., username)
  socket.on("chatMessage", (data) => {
    const { username, message } = data; // Extract username and message
    console.log(`Message from ${username}: ${message}`);

    // Broadcast the message along with the sender's info
    io.emit("chatMessage", { username, message });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

if (process.env.ENV == "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(compression({ filter: shouldCompress }));

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}

// increase upload body size to 50 MB
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes Start ------
app.use("/api/auth", require("./routes/Auth.route"));
app.use("/api/roles", require("./routes/role.route"));
app.use("/api/user", require("./routes/user.route"));
app.use("/api/user-geo-location", require("./routes/user-geo-location.route"));
app.use("/api/files", require("./routes/file.route"));
app.use("/api/class", require("./routes/class.route"));
app.use("/api/subject", require("./routes/subject.route"));
app.use("/api/chapter", require("./routes/chapter.route"));
app.use("/api/topic", require("./routes/topic.route"));
app.use("/api/teacherSchedule", require("./routes/teacherSchedule.route"));
app.use("/api/schedule", require("./routes/scheduleRequest.route"));
app.use("/api/wallet_student", require("./routes/wallet.route"));


const meetingNumber = '4274126291'
const role = 0
const expirationSeconds=172800



const propValidations = {
  role: inNumberArray([0, 1]),
  expirationSeconds: isBetween(1800, 172800)
}

const schemaValidations = [isRequiredAllOrNone(['meetingNumber', 'role'])]
const coerceRequestBody = (body) => ({
  ...body,
  ...['role', 'expirationSeconds'].reduce(
    (acc, cur) => ({ ...acc, [cur]: typeof body[cur] === 'string' ? parseInt(body[cur]) : body[cur] }),
    {}
  )
})

app.post('/signature', (req, res) => {
  const requestBody = coerceRequestBody(req.body)
  const validationErrors = validateRequest(requestBody, propValidations, schemaValidations)

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors })
  }

  const { meetingNumber, role, expirationSeconds } = requestBody
  const iat = Math.floor(Date.now() / 1000)
  const exp = expirationSeconds ? iat + expirationSeconds : iat + 60 * 60 * 2
  const oHeader = { alg: 'HS256', typ: 'JWT' }

  const oPayload = {
    appKey: process.env.ZOOM_MEETING_SDK_KEY,
    sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
    mn: meetingNumber,
    role,
    iat,
    exp,
    tokenExp: exp
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.ZOOM_MEETING_SDK_SECRET)
  return res.json({ signature: sdkJWT, sdkKey: process.env.ZOOM_MEETING_SDK_KEY })
})



// const ZOOM_API_URL = 'https://api.zoom.us/v2/users/me/meetings';
// const ZOOM_JWT_TOKEN = process.env.ZOOM_JWT_TOKEN; // Load from .env file



// app.post('/api/zoom/meetings', async (req, res) => {
//   try {
//       const response = await axios.post(ZOOM_API_URL, req.body, {
//           headers: {
//               Authorization: `Bearer ${ZOOM_JWT_TOKEN}`,
//               'Content-Type': 'application/json',
//           }
//       });

//       res.json(response.data);
//   } catch (error) {
//       console.error('Error scheduling meeting:', error.response?.data || error.message);
//       res.status(error.response?.status || 500).json({
//           error: 'Failed to schedule meeting',
//           details: error.response?.data || error.message
//       });
//   }
// });


// app.get('/api/zoom/meetings', async (req, res) => {
//   try {
//     const response = await axios.get(ZOOM_API_URL, {
//       headers: { Authorization: `Bearer ${ZOOM_JWT_TOKEN}` },
//     });
//     console.log('response.data.meetings', response.data)
//     res.json(response.data.meetings);
//   } catch (error) {
//     console.error('Error fetching meetings:', error);
//     res.status(500).json({ error: 'Failed to fetch meetings' });
//   }
// });

// Route to get a Twilio token
app.post("/get-token", (req, res) => {
  const { identity, roomName } = req.body;

  // console.log("get tocken >>.", identity, roomName);
  // return;

  try {
    const token = generateToken(identity, roomName);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/api", (req, res, next) => {
  next(createError.NotFound());
});
// API Routes End --------

app.use(express.static(path.join(__dirname, "public", "dist", "browser")));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "dist", "browser", "index.html"));
});

app.use((err, req, res, next) => {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.ENV === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.use(async (err, req, res, next) => {
  console.log(err);
  next(createError.NotFound(err));
});

const PORT = process.env.PORT || 3051;
server.listen(PORT, "0.0.0.0", () => {
  debug("Listening on " + PORT);
});
