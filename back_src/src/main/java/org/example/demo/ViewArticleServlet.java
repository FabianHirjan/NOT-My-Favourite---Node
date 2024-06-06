package org.example.demo;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.demo.database.DatabaseConnection;

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
        String articleId = request.getParameter("id");
        if (articleId != null && !articleId.isEmpty()) {
            Article article = getArticleById(articleId);
            List<String> comments = getCommentsByArticleId(articleId);

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

    private Article getArticleById(String articleId) {
        Article article = null;
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM posts WHERE id = ?")) {
            statement.setString(1, articleId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    article = new Article();
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

    private List<String> getCommentsByArticleId(String articleId) {
        List<String> comments = new ArrayList<>();
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT comment FROM comments WHERE post_id = ?")) {
            statement.setString(1, articleId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    comments.add(resultSet.getString("comment"));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return comments;
    }
}
