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
        // console.log("join");
        // console.log(userId);
        socket.join(userId);
    });
    socket.on("send_message", async (messageNew) => {
        try {
            const { senderId, message, receiverId, name, time } = messageNew
            // console.log(messageNew, "message");

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
                _id:newmessage._id,
                status:newmessage.status
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

    socket.on("deletedMessages",async (message) =>{
        // console.log(message);
        const id = message.messageid
        const con = message.con

        const deltedmessage = await Message.findOne({_id:id});

        if(con === "delete"){
            deltedmessage.status = 3
        }else if(con === "only-me"){
            deltedmessage.status = 1
        }else if(con === "everyone"){
            deltedmessage.status = 2
        }
        await deltedmessage.save();
        // console.log(deltedmessage,"deltedmessage");
        // const deletedMessageResponse = {
        //     _id: deltedmessage._id,
        //     status: deltedmessage.status,
        //   };
          socket.emit("deleteMessagereplay", deltedmessage); 
    })

    await socket.on("getMessages", async (message) => {
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
