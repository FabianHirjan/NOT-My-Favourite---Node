const { DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define(
        "Comment",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            post_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'posts',
                    key: 'id',
                },
            },
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            timestamps: false,
            tableName: 'comments',
        }
    );
}