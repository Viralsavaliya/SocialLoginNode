const Message = require("../models/messageModel");
let userMap = []

// const {datafilename} =require('./messageController')
// console.log(datafilename,"dsfghj");




module.exports = async (socket, io) => {
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
            const { senderId, message, receiverId, name, time } = messageNew
            console.log(messageNew, "message");
            // if (!message) {
            //     return socket.emit("message", {
            //         success: false,
            //         message: "message is empty.",
            //       });
            //  }

            const newMsg = {
                senderId,
                receiverId,
                message,
            };
            const newmessage = await Message.create(newMsg);
            const result = {
                senderId: newMsg.senderId,
                receiverId: newMsg.receiverId,
                message: newMsg.message,
                name: name,
                time:time,
                _id:newmessage._id
            }
            userMap.map((el) => {
                if (el.user_id == receiverId) {
                    io.sockets.sockets.get(el.socket_id)?.emit("recive_message", result)
                }
                if(el.user_id == senderId){
                    io.sockets.sockets.get(el.socket_id)?.emit("send_message", result)
                }
            })
        }
        catch (error) {
            console.error(error);
        }
    });

    await socket.on("getMessages", async (message) => {
        console.log(message, "message");
        // return false;
        const receiverId = message.receiverId;
        const senderId = message.senderId;
        const Status = 0;
        const recivestatus = 0 || 1
        const messageAll = await Message.find({
            $or: [
                { receiverId: receiverId, senderId: senderId , status:Status},
                { senderId: receiverId, receiverId: senderId , status:recivestatus},
            ],
        });
        socket.emit("allMessages", messageAll);
    });
};
