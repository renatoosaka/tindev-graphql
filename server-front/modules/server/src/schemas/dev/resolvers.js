import axios from "axios";
import Dev from "./model";

export const list = async (_, __, { req }) => {
  const { user } = req.headers;

  const loggedDev = await Dev.findById(user);

  const devs = await Dev.find({
    $and: [
      {
        _id: { $ne: loggedDev._id }
      },
      {
        _id: { $nin: loggedDev.likes }
      },
      {
        _id: { $nin: loggedDev.dislikes }
      }
    ]
  })
    .populate(["likes", "dislikes"])
    .exec();
  return devs;
};

export const store = async (_, { username }) => {
  const devExists = await Dev.findOne({ user: username });

  if (devExists) {
    return devExists;
  }

  const {
    data: { login, name, bio, avatar_url: avatar }
  } = await axios.get(`https://api.github.com/users/${username}`);

  const dev = await Dev.create({
    name: name || login,
    user: username,
    bio,
    avatar
  });

  return dev;
};

export const like = async (_, { devId }, { req, io, connectedUsers }) => {
  const { user } = req.headers;

  const loggedDev = await Dev.findById(user)
    .populate("likes")
    .exec();

  const targetDev = await Dev.findById(devId);

  if (!targetDev) {
    throw new Error("Dev not exists");
  }

  const matched = await Dev.find({
    _id: devId,
    likes: { $in: [user] }
  });

  if (matched.length > 0) {
    const loggedSocket = connectedUsers[user];
    const targetSocket = connectedUsers[devId];

    if (loggedSocket) {
      io.to(loggedSocket).emit("match", targetDev);
    }

    if (targetSocket) {
      io.to(targetSocket).emit("match", loggedDev);
    }
  }

  const liked = await Dev.find({
    _id: user,
    likes: { $in: [devId] }
  });

  if (liked.length > 0) {
    return loggedDev;
  }

  const dev = await Dev.findOneAndUpdate(
    { _id: user },
    { $push: { likes: devId } },
    { new: true, populate: ["likes"] }
  );

  return dev;
};

export const dislike = async (_, { devId }, { req }) => {
  const { user } = req.headers;

  const loggedDev = await Dev.findById(user)
    .populate("dislikes")
    .exec();
  const targetDev = await Dev.findById(devId);

  if (!targetDev) {
    throw new Error("Dev not exists");
  }

  const disliked = await Dev.find({
    _id: user,
    dislikes: { $in: [devId] }
  });

  if (disliked.length > 0) {
    return loggedDev;
  }

  const dev = await Dev.findOneAndUpdate(
    { _id: user },
    { $push: { dislikes: devId } },
    { new: true, populate: ["dislikes"] }
  );

  return dev;
};
