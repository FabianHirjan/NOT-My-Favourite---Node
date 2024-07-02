const { FriendRequest, User, Post } = require("../models");
const { Op } = require('sequelize');

const friendController = {
    sendFriendRequest: async (req, res) => {
        const { requester_id, receiver_username } = req.body;
        console.log("Sending friend request from", requester_id, "to", receiver_username);
        try {
            const receiver = await User.findOne({ where: { username: receiver_username } });
            console.log(receiver);
            if (!receiver) {
                console.log("User not found");
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: 'User not found.' }));
                return;
            }
            console.log("User found");
            const existingRequest = await FriendRequest.findOne({
                where: {
                    [Op.or]: [
                        { requester_id, receiver_id: receiver.id },
                        { requester_id: receiver.id, receiver_id: requester_id }
                    ],
                    status: 'pending'
                }
            });
            if (existingRequest) {
                console.log("Friend request already sent");
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: 'Friend request already sent.' }));
                return;
            }
            const friendRequest = await FriendRequest.create({ requester_id, receiver_id: receiver.id });
            console.log("Friend request sent");
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(friendRequest));
        } catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    respondToFriendRequest: async (req, res) => {
        const { requestId, status } = req.body;
        console.log("Responding to friend request:", requestId, "with status:", status);
        try {
            const friendRequest = await FriendRequest.findByPk(requestId);
            if (!friendRequest) {
                console.log("Friend request not found");
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: 'Friend request not found.' }));
                return;
            }
            if (status === 'accepted') {
                const existingRequest = await FriendRequest.findOne({
                    where: {
                        requester_id: friendRequest.receiver_id,
                        receiver_id: friendRequest.requester_id,
                        status: 'pending'
                    }
                });
                if (existingRequest) {
                    existingRequest.status = 'accepted';
                    await existingRequest.save();
                } else {
                    await FriendRequest.create({
                        requester_id: friendRequest.receiver_id,
                        receiver_id: friendRequest.requester_id,
                        status: 'accepted'
                    });
                }
            }
            friendRequest.status = status;
            await friendRequest.save();
            console.log("Friend request updated");
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(friendRequest));
        } catch (error) {
            console.log("Error responding to friend request:", error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    getIncomingFriendRequests: async (req, res) => {
        const { userId } = req.params;
        console.log("Getting incoming friend requests for user with ID:", userId);
        try {
            const requests = await FriendRequest.findAll({
                where: { receiver_id: userId, status: 'pending' },
                include: [{ model: User, as: 'requester', attributes: ['id', 'username'] }]
            });
            console.log("Incoming friend requests:", requests);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(requests));
        } catch (error) {
            console.log("Error getting incoming friend requests:", error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    getFriends: async (req, res) => {
        const { userId } = req.params;
        console.log("Fetching friends for user with ID:", userId);
        try {
            const friends = await FriendRequest.findAll({
                where: {
                    status: 'accepted',
                    [Op.or]: [
                        { requester_id: userId },
                        { receiver_id: userId }
                    ]
                },
                include: [
                    { model: User, as: 'requester', attributes: ['id', 'username'] },
                    { model: User, as: 'receiver', attributes: ['id', 'username'] }
                ]
            });

            const uniqueFriends = new Map();
            friends.forEach(friend => {
                if (friend.requester_id === userId) {
                    uniqueFriends.set(friend.receiver.id, friend.receiver);
                } else {
                    uniqueFriends.set(friend.requester.id, friend.requester);
                }
            });

            // Remove the current user from the friends list
            uniqueFriends.delete(parseInt(userId));

            console.log("Unique friends found:", [...uniqueFriends.values()]);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify([...uniqueFriends.values()]));
        } catch (error) {
            console.log("Error fetching friends:", error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    getFriendReviews: async (req, res) => {
        const { friendId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const offset = (page - 1) * limit;

        console.log("Fetching reviews for friend with ID:", friendId, "Page:", page);
        try {
            const { count, rows: reviews } = await Post.findAndCountAll({
                where: { user_id: friendId },
                limit,
                offset
            });

            const totalPages = Math.ceil(count / limit);

            console.log("Reviews found:", reviews);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ reviews, totalPages }));
        } catch (error) {
            console.log("Error fetching friend reviews:", error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: error.message }));
        }
    },
};

module.exports = friendController;
