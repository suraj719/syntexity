const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ACTIONS = require("./src/Actions");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const { default: axios } = require("axios");
const nodemailer = require("nodemailer");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://syntexity.vercel.app/", // Replace with the actual origin of your client application
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: "Invalid username" });

      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) return done(null, false, { message: "Invalid password" });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Express session
app.use(
  session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(
    "mongodb+srv://syntexity:syntexity@cluster0.kqn8npq.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("user", UserSchema);

const createuser = async (req, res) => {
  const emailExists = await User.findOne({ email: req.body.email });

  if (emailExists) return res.status(400).send("Email already exists");

  const usernameExists = await User.findOne({ username: req.body.username });

  if (usernameExists) return res.status(400).send("Username already exists");

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const hasheduser = new User({
    username: req.body.username.toUpperCase(),
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const saveduser = await User.create(hasheduser);
    res.status(201).json(saveduser);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const loginUser = async (req, res) => {
  const user = await User.findOne({
    username: req.body.username.toUpperCase(),
  });
  if (!user) return res.status(400).send("Invalid username");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  const token = jwt.sign({ name: user.username }, "sfsfs");
  try {
    res.send({ token: token });
  } catch (error) {
    res.send("Incorrect login details");
  }
};

const ChatMessage = mongoose.model("ChatMessage", {
  username: String,
  message: String,
});

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", ({ username, roomId }) => {
    userSocketMap[socket.id] = username; // Store the username associated with the socket ID
    socket.join(roomId); // Join the specified room

    // Get all connected clients in the room
    const clients = getAllConnectedClients(roomId);

    // Iterate over each client in the room and emit a message to inform them about the new user
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("userJoined", {
        clients, // Send the updated list of clients to each client
        username, // Send the username of the new user
        socketId: socket.id, // Send the socket ID of the new user
      });
    });
  });

  // Handle keep-alive messages from the client
  socket.on("keep-alive", () => {
    console.log("Received keep-alive message from client:", socket.id);
  });

  // Other event handlers and logic for your application

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[socket.id]; // Remove the disconnected user from the map
  });
});

// io.on("connection", (socket) => {
//   console.log("socket connected", socket.id);

//   socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
//     userSocketMap[socket.id] = username;
//     socket.join(roomId);
//     const clients = getAllConnectedClients(roomId);
//     clients.forEach(({ socketId }) => {
//       io.to(socketId).emit(ACTIONS.JOINED, {
//         clients,
//         username,
//         socketId: socket.id,
//       });
//     });
//   });

//   socket.on(ACTIONS.SEND_MESSAGE, ({ roomId, message }) => {
//     const senderUsername = userSocketMap[socket.id];
//     const chatMessage = new ChatMessage({ senderUsername, message });
//     chatMessage.save();
//     io.in(roomId).emit(ACTIONS.RECEIVE_MESSAGE, {
//       username: senderUsername,
//       message,
//     });
//   });

//   socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
//     socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
//   });

//   socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
//     io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
//   });

//   socket.on(ACTIONS.TOGGLE_EDITOR_LOCK, ({ roomId, editorLocked }) => {
//     // Emit the new TOGGLE_EDITOR_LOCK action to other users in the room
//     socket.to(roomId).emit(ACTIONS.TOGGLE_EDITOR_LOCK, { editorLocked });
//   });

//   // Handle UPLOAD_FILE event on the server side
//   socket.on("UPLOAD_FILE", ({ roomId, fileContent }) => {
//     // Broadcast the file content to all participants in the room
//     io.to(roomId).emit("SYNC_CODE", { code: fileContent });
//   });

//   socket.on("disconnecting", () => {
//     const rooms = [...socket.rooms];
//     rooms.forEach((roomId) => {
//       socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//         socketId: socket.id,
//         username: userSocketMap[socket.id],
//       });
//     });
//     delete userSocketMap[socket.id];
//     socket.leave();
//   });
// });

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const router = express.Router();
router.route("/signup").post(createuser);
router.route("/login").post(loginUser);
// router.route("/compile").post(CompileCode);

app.post("/execute", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

app.use("/api", router);

const refreshToken =
  "1//0486lIXrIORO7CgYIARAAGAQSNwF-L9IrYlS6AqLB0ymaEzX1cmsSh--2yQGS6q6nFeVWXbiu6Wd7Fs74Zsaa0NR3bRvDldZDHAI";

const clientId =
  "338103656583-tbds3005m3r956c71vmbjpap58gu79q7.apps.googleusercontent.com";
const clientSecret = "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";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "gitty693@gmail.com",
    pass: "suraj@2012",
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
  },
});

app.post("/mail", async (req, res) => {
  try {
    await transporter.sendMail({
      from: "gitty693@gmail.com",
      to: req.body.toMail,
      subject: "Your customized SOP report",
      text: `${req.body.usernameJoined} have joined`,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ msg: error.msg });
  }
});
