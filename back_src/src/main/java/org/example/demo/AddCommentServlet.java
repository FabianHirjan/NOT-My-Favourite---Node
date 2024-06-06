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

@WebServlet(name = "AddCommentServlet", value = "/add-comment-servlet")
public class AddCommentServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String comment = request.getParameter("comment");
        String articleId = request.getParameter("articleId");

        if (comment != null && !comment.isEmpty() && articleId != null && !articleId.isEmpty()) {
            try (Connection connection = DatabaseConnection.getConnection();
                 PreparedStatement statement = connection.prepareStatement("INSERT INTO comments (comment, post_id) VALUES (?, ?)")) {

                statement.setString(1, comment);
                statement.setString(2, articleId);

                int rowsInserted = statement.executeUpdate();
                if (rowsInserted > 0) {
                    System.out.println("A new comment was inserted successfully!");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        response.sendRedirect("view-article-servlet?id=" + articleId);  // Redirect back to the article page
    }
}