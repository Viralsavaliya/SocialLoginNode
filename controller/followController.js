const Follow = require('../models/followModel')
const User = require('../models/userModel')

exports.getallfollwer = async (req, res) => {
    try {
        const allFollowers = await Follow.find()
        res.status(200).json({
            success: true,
            data: allFollowers,
            message: 'followers fetched successfully'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.sendfollowrequest = async (req, res) => {
    try {
        const id = req.user._id;
        const { followerId } = req.query;

        const newFollow = new Follow({
            followerId,
            userId: id
        })
        const craetefollower = await Follow.create(newFollow);
        res.status(200).json({
            success: true,
            data: craetefollower,
            message: 'follow request sent successfully'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


exports.acceptrequestrequest = async (req, res) => {
    try {
        const id = req.user._id;

        const aceptid = req.query.id

        const findrequest = await Follow.findOne({ _id: aceptid });

        findrequest.status = 1;

        const acceptrequest = await findrequest.save();
        res.status(200).json({
            success: true,
            data: acceptrequest,
            message: 'follow request acept successfully'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

exports.getonealluserrequest = async (req, res) => {
    try {
        const id = req.user._id;
        const findrequest = await Follow.find({ followerId: id, status: 0 }).populate('userId');
        res.status(200).json({
            success: true,
            data: findrequest,
            message: 'followers fetched successfully'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.rejectrequest = async (req, res) => {
    try {
        const id = req.user._id;

        const aceptid = req.query.id

        const findrequest = await Follow.findOne({ _id: aceptid });

        findrequest.status = 2;

        const acceptrequest = await findrequest.save();
        res.status(200).json({
            success: true,
            data: acceptrequest,
            message: 'follow request acept successfully'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

exports.getallfollowuser = async (req, res) => {
    try {
        const userId = req.user._id;
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            {
                $lookup: {
                    from: "follows",
                    let: { userId: userId, followerId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", "$$userId"] },
                                        { $eq: ["$followerId", "$$followerId"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "followStatus"
                }
            },
            {
                $project: {
                    _id: 1,
                    userName: 1,
                    image: 1,
                    followStatus: {
                        $cond: [
                            { $eq: [{ $size: "$followStatus" }, 0] },
                            null,
                            {
                                $switch: {
                                    branches: [
                                        { case: { $eq: [{ $arrayElemAt: ["$followStatus.status", 0] }, 0] }, then: 0 },
                                        { case: { $eq: [{ $arrayElemAt: ["$followStatus.status", 0] }, 1] }, then: 1 },
                                        { case: { $eq: [{ $arrayElemAt: ["$followStatus.status", 0] }, 2] }, then: 2 }
                                    ],
                                    default: null
                                }
                            }
                        ]
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: users,
            message: "All users retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getoneuserallfollowing = async (req, res) => {
    try {
      const userId = req.user._id;
      const users = await User.aggregate([
        {
          $match: {
            _id: userId
          }
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "userId",
            as: "followingUsers"
          }
        },
        {
          $addFields: {
            followedUserIds: {
              $map: {
                input: {
                  $filter: {
                    input: "$followingUsers",
                    as: "follow",
                    cond: { $eq: ["$$follow.status", 1] }
                  }
                },
                as: "follow",
                in: "$$follow.followerId"
              }
            }
          }
        },
        {
          $lookup: {
            from: "userdatas",
            let: { followedUserIds: "$followedUserIds" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$followedUserIds"]
                  }
                }
              }
            ],
            as: "followedUsers"
          }
        },
        {
          $project: {
            _id: 1,
            userName: 1,
            image: 1,
            followedUsers: 1,
            followCount: { $size: "$followedUsers" }
          }
        }
      ]);
  
      res.status(200).json({
        success: true,
        data: users,
        message: "Follow records retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  
exports.deletefollower = async (req, res) => {
    try {
        const id = req.user._id;
        const userId = req.query.id

        const deletefollower = await Follow.deleteOne({ followerId:userId , userId: id })

      
        res.status(200).json({
            success: true,
            data: deletefollower,
            message: 'followers remove successfully'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}






