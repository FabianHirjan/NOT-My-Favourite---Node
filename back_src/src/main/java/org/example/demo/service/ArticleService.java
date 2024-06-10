package org.example.demo.service;

import org.example.demo.database.DatabaseConnection;
import org.example.demo.dto.ArticleDTO;
import org.example.demo.dto.CategoryDTO;
import org.example.demo.dto.CommentDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class ArticleService {

    public List<ArticleDTO> getArticlesByTypeAndCategory(String type, String category) {
        List<ArticleDTO> articles = new ArrayList<>();
        String query = "SELECT posts.*, categories.name AS category_name FROM posts INNER JOIN categories ON posts.category_id = categories.id WHERE type = ? AND category_id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, type); // Corrected here
            statement.setString(2, category); // Corrected here

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    ArticleDTO article = new ArticleDTO();
                    article.setId(resultSet.getInt("id"));
                    article.setTitle(resultSet.getString("title"));
                    article.setContent(resultSet.getString("content"));
                    article.setPoster(resultSet.getString("poster"));
                    article.setStars(resultSet.getInt("stars"));
                    article.setIsApproved(resultSet.getInt("approved"));
                    article.setCategoryName(resultSet.getString("category_name"));
                    articles.add(article);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return articles;
    }

    public List<CategoryDTO> getAllCategories() {
        List<CategoryDTO> categories = new ArrayList<>();
        String query = "SELECT id, name FROM categories";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    CategoryDTO category = new CategoryDTO();
                    category.setId(resultSet.getInt("id"));
                    category.setName(resultSet.getString("name"));
                    categories.add(category);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return categories;
    }

    public ArticleDTO getArticleById(int articleId) {
        ArticleDTO article = null;
        String query = "SELECT * FROM posts WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {

            statement.setInt(1, articleId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    article = new ArticleDTO();
                    article.setId(resultSet.getInt("id"));
                    article.setTitle(resultSet.getString("title"));
                    article.setContent(resultSet.getString("content"));
                    article.setPoster(resultSet.getString("poster"));
                    article.setStars(resultSet.getInt("stars"));
                    article.setIsApproved(resultSet.getInt("approved"));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return article;
    }

    public boolean deleteArticle(int articleId) {
        String deleteCommentsQuery = "DELETE FROM comments WHERE post_id = ?";
        String deleteArticleQuery = "DELETE FROM posts WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection()) {
            connection.setAutoCommit(false);

            // Ștergeți comentariile asociate
            try (PreparedStatement deleteCommentsStatement = connection.prepareStatement(deleteCommentsQuery)) {
                deleteCommentsStatement.setInt(1, articleId);
                deleteCommentsStatement.executeUpdate();
            }

            // Ștergeți articolul
            try (PreparedStatement deleteArticleStatement = connection.prepareStatement(deleteArticleQuery)) {
                deleteArticleStatement.setInt(1, articleId);
                deleteArticleStatement.executeUpdate();
            }

            connection.commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            try (Connection connection = DatabaseConnection.getConnection()) {
                connection.rollback();
            } catch (Exception rollbackEx) {
                rollbackEx.printStackTrace();
            }
        }
        return false;
    }

    public boolean approveArticle(int articleId) {
        String query = "UPDATE posts SET approved = 1 WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setInt(1, articleId);
            statement.executeUpdate();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateArticle(int articleId, ArticleDTO articleDTO) {
        String query = "UPDATE posts SET title = ?, content = ?, poster = ?, stars = ?, type = ?, approved = ? WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {

            statement.setString(1, articleDTO.getTitle());
            statement.setString(2, articleDTO.getContent());
            statement.setString(3, articleDTO.getPoster());
            statement.setInt(4, articleDTO.getStars());
            statement.setString(5, articleDTO.getType());
            statement.setInt(6, articleDTO.getIsApproved());
            statement.setInt(7, articleId);

            int rowsUpdated = statement.executeUpdate();
            return rowsUpdated > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<CommentDTO> getCommentsByArticleId(int articleId) {
        List<CommentDTO> comments = new ArrayList<>();
        String query = "SELECT comment, poster, agree FROM comments WHERE post_id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {

            statement.setInt(1, articleId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    CommentDTO comment = new CommentDTO();
                    comment.setComment(resultSet.getString("comment"));
                    comment.setPoster(resultSet.getString("poster"));
                    comment.setAgree(resultSet.getString("agree"));
                    comments.add(comment);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return comments;
    }

    public static List<ArticleDTO> getAllArticles() {
        List<ArticleDTO> articles = new ArrayList<>();
        String query = "SELECT * FROM posts";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    ArticleDTO article = new ArticleDTO();
                    article.setId(resultSet.getInt("id"));
                    article.setTitle(resultSet.getString("title"));
                    article.setContent(resultSet.getString("content"));
                    article.setPoster(resultSet.getString("poster"));
                    article.setStars(resultSet.getInt("stars"));
                    article.setIsApproved(resultSet.getInt("approved"));
                    articles.add(article);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    return articles;
    }
}
