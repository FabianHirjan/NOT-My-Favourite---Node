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

@WebServlet(name = "ArticleServlet", value = "/article-servlet")
public class ArticleServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    private List<Article> getArticlesByType(String type, boolean isAdmin) {
        List<Article> articles = new ArrayList<>();
        String query = "SELECT * FROM posts WHERE type = ?";
        if (!isAdmin) {
            query += " AND approved = ?";
        }
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, type);
            if (!isAdmin) {
                statement.setInt(2, 1);
            }
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    Article article = new Article();
                    article.setId(resultSet.getInt("id"));
                    article.setTitle(resultSet.getString("title"));
                    article.setContent(resultSet.getString("content"));
                    article.setPoster(resultSet.getString("poster"));
                    article.setStars(resultSet.getInt("stars"));
                    articles.add(article);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return articles;
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String type = request.getParameter("type");
        boolean isAdmin = request.getSession().getAttribute("admin") != null && (boolean) request.getSession().getAttribute("admin");
        if (type != null && !type.isEmpty()) {
            List<Article> articles = getArticlesByType(type, isAdmin);
            request.setAttribute("articles", articles);
        }
        request.getRequestDispatcher("articles.jsp").forward(request, response);
    }
}
