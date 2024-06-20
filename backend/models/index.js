const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres://postgres:admin@localhost:5432/nofdatabase");

const UserModel = require("./user");
const PostModel = require("./post");
const CommentModel = require("./comment");
const CategoryModel = require("./category");

const User = UserModel(sequelize);
const Post = PostModel(sequelize);
const Comment = CommentModel(sequelize);
const Category = CategoryModel(sequelize);

User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

Category.hasMany(Post, { foreignKey: 'category', sourceKey: 'name' });
Post.belongsTo(Category, { foreignKey: 'category', targetKey: 'name' });

sequelize.sync({ force: false }).then(() => {
  console.log("Database & tables created!");
});

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Category
};
