const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/UserModel');
const { ConversationModel, MessageModel } = require('../models/ConversationModel');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Maintain online users
const onlineUser = new Set();

io.on('connection', async (socket) => {
  console.log('A user connected:', socket.id);

  try {
    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    if (!user?._id) {
      socket.disconnect();
      return;
    }

    // Join user-specific room
    const userId = user._id.toString();
    socket.join(userId);
    onlineUser.add(userId);
    io.emit('onlineUser', Array.from(onlineUser));

    // Handle message page request
    socket.on('message-page', async (otherUserId) => {
      try {
        const userDetails = await UserModel.findById(otherUserId).select('-password');
        const payload = {
          _id: userDetails?._id,
          name: userDetails?.name,
          email: userDetails?.email,
          profile_pic: userDetails?.profile_pic,
          online: onlineUser.has(otherUserId),
        };
        socket.emit('message-user', payload);
      } catch (err) {
        console.error('Error in message-page:', err);
      }
    });

    // Handle new message
    socket.on('new message', async (data) => {
      try {
        let conversation = await ConversationModel.findOne({
          $or: [
            { sender: data?.sender, receiver: data?.receiver },
            { sender: data?.receiver, receiver: data?.sender },
          ],
        });

        // Create new message
        const message = new MessageModel({
          text: data?.text,
          imageUrl: data?.imageUrl,
          videoUrl: data?.videoUrl,
          msgByUserId: data?.msgByUserId,
        });
        const saveMessage = await message.save();

        // const updateConversation = await ConversationModel.updateOne(
        //   { _id: conversation._id },
        //   { $push: { messages: saveMessage._id } }
        // );

        if (!conversation) {
          // Create new conversation
          const newConversation = new ConversationModel({
            sender: data?.sender,
            receiver: data?.receiver,
            messages: [saveMessage._id],
          });
          conversation = await newConversation.save();
        } else {
          // Update existing conversation
          await ConversationModel.updateOne(
            { _id: conversation._id },
            { $push: { messages: saveMessage._id } }
          );
        }

        // Get updated conversation with messages
        const getConversationMessage = await ConversationModel.findOne({
          _id: conversation._id,
        })
          .populate('messages')
          .sort({ updatedAt: -1 });

        // Emit messages to both users
        io.to(data?.sender).emit('message', getConversationMessage.messages);
        io.to(data?.receiver).emit('message', getConversationMessage.messages);

      } catch (error) {
        console.error('Error handling new message:', error);
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      onlineUser.delete(userId);
      io.emit('onlineUser', Array.from(onlineUser));
      console.log('User disconnected:', socket.id);
    });

  } catch (error) {
    console.error('Socket connection error:', error);
    socket.disconnect();
  }
});

module.exports = {
  app,
  server,
};
