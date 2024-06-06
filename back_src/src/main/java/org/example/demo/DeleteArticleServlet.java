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

@WebServlet(name = "DeleteArticleServlet", value = "/delete-article-servlet")
public class DeleteArticleServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String articleId = request.getParameter("articleId");

        try (Connection connection = DatabaseConnection.getConnection()) {
            // Ștergeți mai întâi comentariile asociate cu articolul
            try (PreparedStatement deleteCommentsStatement = connection.prepareStatement("DELETE FROM comments WHERE post_id = ?")) {
                deleteCommentsStatement.setInt(1, Integer.parseInt(articleId));
                deleteCommentsStatement.executeUpdate();
            }

            // Apoi ștergeți articolul
            try (PreparedStatement deleteArticleStatement = connection.prepareStatement("DELETE FROM posts WHERE id = ?")) {
                deleteArticleStatement.setInt(1, Integer.parseInt(articleId));
                deleteArticleStatement.executeUpdate();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        response.sendRedirect("articles.jsp");
    }
}