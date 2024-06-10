package org.example.demo.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.demo.database.DatabaseConnection;
import org.example.demo.dto.ArticleDTO;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "ViewUserProfileServlet", value = "/view-user-profile-servlet")
public class ViewUserProfileServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        String  userId = (String) session.getAttribute("name");
        if (userId != null && !userId.isEmpty()) {
            List<ArticleDTO> articles = getUserArticles(userId);
            request.setAttribute("userArticles", articles);
            request.getRequestDispatcher("/myaccount.jsp").forward(request, response);
        } else {
            response.sendRedirect("/error.jsp");  // Redirect to error page if userId is not provided
        }
    }

    private List<ArticleDTO> getUserArticles(String userId) {
        List<ArticleDTO> articles = new ArrayList<>();
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM posts WHERE poster = ?")) {
            statement.setString(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    ArticleDTO article = new ArticleDTO();
                    article.setId(resultSet.getInt("id"));
                    article.setTitle(resultSet.getString("title"));
                    article.setContent(resultSet.getString("content"));
                    article.setPoster(resultSet.getString("poster"));
                    article.setStars(resultSet.getInt("stars"));
                    article.setType(resultSet.getString("type"));
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
