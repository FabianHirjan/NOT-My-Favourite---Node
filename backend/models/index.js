const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres://postgres:admin@localhost:5432/nofdatabase");

const UserModel = require("./user");
const PostModel = require("./post");
const CommentModel = require("./comment");
const CategoryModel = require("./category");
const UserLikeModel = require("./userLike");

const User = UserModel(sequelize, Sequelize.DataTypes);
const Post = PostModel(sequelize, Sequelize.DataTypes);
const Comment = CommentModel(sequelize, Sequelize.DataTypes);
const Category = CategoryModel(sequelize, Sequelize.DataTypes);
const UserLike = UserLikeModel(sequelize, Sequelize.DataTypes);

User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

Category.hasMany(Post, { foreignKey: 'category', sourceKey: 'name' });
Post.belongsTo(Category, { foreignKey: 'category', targetKey: 'name' });

User.belongsToMany(Post, { through: UserLike, foreignKey: 'user_id' });
Post.belongsToMany(User, { through: UserLike, foreignKey: 'post_id' });

sequelize.sync({ force: false }).then(() => {
  console.log("Database & tables created!");
});

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Category,
  UserLike
};