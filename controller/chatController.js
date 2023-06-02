const Message = require("../controller/messageController");

module.exports = (socket, io) => {
    console.log("function in connected");
    socket.on('join', (userId) => {
        socket.join(4 );
    });
    socket.on("sendMessage", async (messageNew) => {
        const {userId, message, receiverId, name} = messageNew
        const newMsg = {
            senderId: userId,
            receiverId,
            message: message,
        };
        await Message.create(newMsg);
        const result = {
            senderId: newMsg.senderId,
            receiverId: newMsg.receiverId,
            message: newMsg.message,
            name: name,
        }
        socket.to(receiverId).emit("receiveMessage", result);
    });
    
    socket.on("getMessages", async (message) => {
        const receiverId = message.receiverId;
        const senderId = message.senderId;
        const messageAll = await Message.find({
            $or: [
                {receiverId: receiverId, senderId: senderId},
                {senderId: receiverId, receiverId: senderId}
            ]
        }).populate(["senderId", "receiverId"]);
        socket.emit("allMessages", messageAll)
    })
};
