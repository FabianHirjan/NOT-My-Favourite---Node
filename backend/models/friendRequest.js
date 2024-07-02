const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define(
        "FriendRequest",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            requester_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            receiver_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            status: {
                type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
                defaultValue: 'pending',
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            timestamps: false,
            tableName: 'friend_requests',
        }
    );
};
