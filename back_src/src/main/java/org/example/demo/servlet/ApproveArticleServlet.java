package org.example.demo.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.demo.database.DatabaseConnection;
import org.example.demo.dto.ArticleDTO;
import org.example.demo.service.ArticleService;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

@WebServlet(name = "ApproveArticleServlet", value = "/approve-article-servlet")
public class ApproveArticleServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String articleId = request.getParameter("articleId");

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement("UPDATE posts SET approved = 1 WHERE id = ?")) {
            statement.setInt(1, Integer.parseInt(articleId));
            statement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }

        response.sendRedirect("articles-servlet");
    }
}