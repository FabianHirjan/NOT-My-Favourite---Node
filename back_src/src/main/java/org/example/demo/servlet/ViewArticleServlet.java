package org.example.demo.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import org.example.demo.database.*;

import java.util.List;
import java.util.ArrayList;

import com.google.gson.Gson;

@WebServlet(name = "ViewArticleServlet", value = "/view-article-servlet")
public class ViewArticleServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int articleId = Integer.parseInt(request.getParameter("articleId"));
        displayArticle(articleId, response);
    }

    private void displayArticle(int postId, HttpServletResponse response) throws IOException {
        Connection connection = DatabaseConnection.getConnection();
        try {
            PreparedStatement statement = connection.prepareStatement("SELECT * FROM comments WHERE post_id = ?");
            statement.setInt(1, postId);
            ResultSet resultSet = statement.executeQuery();
            List<CommentResponse> comments = new ArrayList<>();
            while (resultSet.next()) {
                CommentResponse commentResponse = new CommentResponse(
                        resultSet.getInt("id"),
                        resultSet.getInt("post_id"),
                        resultSet.getString("comment")
                );
                comments.add(commentResponse);
            }
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            Gson gson = new Gson();
            String jsonResponse = gson.toJson(comments);
            out.print(jsonResponse);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    class CommentResponse {
        private int id;
        private int postId;
        private String comment;

        public CommentResponse(int id, int postId, String comment) {
            this.id = id;
            this.postId = postId;
            this.comment = comment;
        }
    }
}