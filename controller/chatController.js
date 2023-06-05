const Message = require("../models/messageModel");
const { io } = require("../app");
let userMap = []

module.exports =async (socket, io) => {
    userMap.push({
        user_id: socket.handshake.query['user_id'],
        socket_id: socket.id,
    })

    socket.on('join', (userId) => {
        console.log("join");
        console.log(userId);
        socket.join(userId);
    });
    socket.on("send_message", async (messageNew) => {
        try {
            const { senderId, message, receiverId, name } = messageNew
            const newMsg = {
                senderId,
                receiverId,
                message,
            };
            await Message.create(newMsg);
            const result = {
                senderId: newMsg.senderId,
                receiverId: newMsg.receiverId,
                message: newMsg.message,
                name: name,
            }
            userMap.map((el) => {
                if (el.user_id == receiverId) {
                    io.sockets.sockets.get(el.socket_id)?.emit("recive_message", result)
                }
            })
        }
        catch (error) {
            console.error(error);
        }
    });

            await socket.on("getMessages", async (message) => {
                console.log(message,"message");
                // return false;
                const receiverId = message.receiverId;
                const senderId = message.senderId;
                const messageAll = await Message.find({
                    $or: [
                        { receiverId: receiverId, senderId: senderId },
                        { senderId: receiverId, receiverId: senderId },
                    ],
                });
                socket.emit("allMessages", messageAll);
            });
};
