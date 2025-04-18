import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedinUserid = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedinUserid },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUserForSidebar: ", error.message);
    res.status(500).json({ error: "internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, ReceiverId: userToChatId },
        { senderId: userToChatId, ReceiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage controller: ", error.message);
    res.status(500).json({ error: "internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: ReceiverId } = req.params;
    const senderId = req.user._id;

    let imaageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imaageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      ReceiverId,
      text,
      image: imaageUrl,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "internal Server Error" });
  }
};
