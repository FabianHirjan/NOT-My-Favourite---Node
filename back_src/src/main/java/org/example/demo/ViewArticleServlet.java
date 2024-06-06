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

@WebServlet(name = "ViewArticleServlet", value = "/view-article-servlet")
public class ViewArticleServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String articleId = request.getParameter("articleId");

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM articles WHERE id = ?")) {
            statement.setInt(1, Integer.parseInt(articleId));
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                Article article = new Article();
                article.setId(resultSet.getInt("id"));
                article.setTitle(resultSet.getString("title"));
                article.setPoster(resultSet.getString("poster"));
                // set other fields as necessary

                request.setAttribute("article", article);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        request.getRequestDispatcher("viewArticle.jsp").forward(request, response);
    }
}