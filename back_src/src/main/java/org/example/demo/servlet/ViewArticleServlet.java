package org.example.demo;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.demo.database.DatabaseConnection;
import org.example.demo.dto.ArticleDTO;
import org.example.demo.dto.CommentDTO;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "ViewArticleServlet", value = "/view-article-servlet")
public class ViewArticleServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String articleId = request.getParameter("articleId");
        if (articleId != null && !articleId.isEmpty()) {
            ArticleDTO article = getArticleById(articleId);
            List<CommentDTO> comments = getCommentsByArticleId(articleId);

            if (article != null) {
                request.setAttribute("article", article);
                request.setAttribute("articleComments", comments);
                request.getRequestDispatcher("/viewArticle.jsp").forward(request, response);
            } else {
                response.sendRedirect("/error.jsp");  // Redirect to error page if no article found
            }
        } else {
            response.sendRedirect("/error.jsp");  // Redirect to error page if ID is not provided
        }
    }

    private ArticleDTO getArticleById(String articleId) {
        ArticleDTO article = null;
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM posts WHERE id = ?")) {
            statement.setString(1, articleId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    article = new ArticleDTO();
                    article.setId(resultSet.getInt("id"));
                    article.setTitle(resultSet.getString("title"));
                    article.setContent(resultSet.getString("content"));
                    article.setPoster(resultSet.getString("poster"));
                    article.setStars(resultSet.getInt("stars"));
                    article.setType(resultSet.getString("type"));
                    article.setIsApproved(resultSet.getInt("approved"));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return article;
    }

    private List<CommentDTO> getCommentsByArticleId(String articleId) {
        List<CommentDTO> comments = new ArrayList<>();
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT comment, poster, agree FROM comments WHERE post_id = ?")) {
            statement.setString(1, articleId);
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
}
