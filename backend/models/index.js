const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres://postgres:admin@localhost:5432/nofdatabase");

const UserModel = require("./user");
const PostModel = require("./post");
const CommentModel = require("./comment");
const UserLikeModel = require("./userLike");
const FriendRequestModel = require("./friendRequest"); // Import FriendRequest model

const User = UserModel(sequelize, Sequelize.DataTypes);
const Post = PostModel(sequelize, Sequelize.DataTypes);
const Comment = CommentModel(sequelize, Sequelize.DataTypes);
const UserLike = UserLikeModel(sequelize, Sequelize.DataTypes);
const FriendRequest = FriendRequestModel(sequelize, Sequelize.DataTypes); // Define FriendRequest model

User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

// Eliminate Category associations
// Category.hasMany(Post, { foreignKey: 'category', sourceKey: 'name' });
// Post.belongsTo(Category, { foreignKey: 'category', targetKey: 'name' });

User.belongsToMany(Post, { through: UserLike, foreignKey: 'user_id' });
Post.belongsToMany(User, { through: UserLike, foreignKey: 'post_id' });

// Associations for FriendRequest model
User.hasMany(FriendRequest, { foreignKey: 'requester_id', as: 'requester' });
User.hasMany(FriendRequest, { foreignKey: 'receiver_id', as: 'receiver' });

FriendRequest.belongsTo(User, { foreignKey: 'requester_id', as: 'requester' });
FriendRequest.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

sequelize.sync({ force: false }).then(() => {
  console.log("Database & tables created!");
});

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  UserLike,
  FriendRequest // Export FriendRequest model
};
