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

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String type = request.getParameter("type");
        if (type != null && !type.isEmpty()) {
            List<Article> articles = getArticlesByType(type);
            request.setAttribute("articles", articles);
        }
        request.getRequestDispatcher("articles.jsp").forward(request, response);
    }

    private List<Article> getArticlesByType(String type) {
        List<Article> articles = new ArrayList<>();
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM posts WHERE type = ? AND approved = ?")) {
            statement.setString(1, type);
            statement.setInt(2, 1);
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
        System.out.println("Number of articles: " + articles.size()); // Add this line
        return articles;
    }
}
