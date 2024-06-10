package org.example.demo.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.demo.database.DatabaseConnection;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@WebServlet(name = "AddCommentServlet", value = "/add-comment-servlet")
public class AddCommentServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String comment = request.getParameter("comment");
        String articleId = request.getParameter("articleId");
        String poster = (String) request.getSession().getAttribute("name");
        String agree = request.getParameter("drone");
        if (comment != null && !comment.isEmpty() && articleId != null && !articleId.isEmpty()) {
            try (Connection connection = DatabaseConnection.getConnection();
                 PreparedStatement statement = connection.prepareStatement("INSERT INTO comments (comment, post_id, poster, agree) VALUES (?, ?, ?, ?)")) {
                statement.setString(1, comment);
                statement.setString(2, articleId);
                statement.setString(3, poster);
                statement.setString(4, agree);
                int rowsInserted = statement.executeUpdate();
                if (rowsInserted > 0) {
                    System.out.println("A new comment was inserted successfully!");
                }
            } catch (Exception e) {
                System.out.printf("Error inserting comment: %s%n", e.getMessage());
                e.printStackTrace();
            }
        }
        System.out.println(articleId);
        response.sendRedirect("view-article-servlet?articleId=" + articleId);
    }
}
