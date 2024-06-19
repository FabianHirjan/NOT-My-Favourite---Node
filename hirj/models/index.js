const { Sequelize } = require("sequelize");

const UserModel = require("./user");
const PostModel = require("./post");
const CommentModel = require("./comment");

// Initialize Sequelize with the database connection string
const sequelize = new Sequelize("postgres://postgres:admin@localhost:5432/nofdatabase");

// Initialize models
const User = UserModel(sequelize);
const Post = PostModel(sequelize);
const Comment = CommentModel(sequelize);

// Define associations
User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });


// Sync database
sequelize.sync({ force: false }).then(() => {
  console.log("Database & tables created!");
});

// Export models and sequelize
module.exports = {
  sequelize,
  User,
  Post,
  Comment,
};
