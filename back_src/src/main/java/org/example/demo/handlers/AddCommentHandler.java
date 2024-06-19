package org.example.demo.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.example.demo.database.DatabaseConnection;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class AddCommentHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if ("POST".equals(exchange.getRequestMethod())) {
            String query = new String(exchange.getRequestBody().readAllBytes());
            String[] params = query.split("&");
            String comment = null;
            String articleId = null;
            String poster = null;
            String agree = null;

            for (String param : params) {
                String[] keyValue = param.split("=");
                if (keyValue.length == 2) {
                    switch (keyValue[0]) {
                        case "comment":
                            comment = keyValue[1];
                            break;
                        case "articleId":
                            articleId = keyValue[1];
                            break;
                        case "poster":
                            poster = keyValue[1];
                            break;
                        case "agree":
                            agree = keyValue[1];
                            break;
                    }
                }
            }

            if (comment != null && !comment.isEmpty() && articleId != null && !articleId.isEmpty()) {
                try (Connection connection = DatabaseConnection.getConnection();
                     PreparedStatement statement = connection.prepareStatement("INSERT INTO comments (comment, post_id, poster, agree) VALUES (?, ?, 'Fabean', ?)")) {
                    statement.setString(1, comment);
                    statement.setString(2, articleId);
                    statement.setString(3, poster);
                    statement.setString(4, agree);
                    int rowsInserted = statement.executeUpdate();
                    if (rowsInserted > 0) {
                        System.out.println("A new comment was inserted successfully!");
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

            String redirectUrl = "http://localhost:8000/view-article?articleId=" + articleId;
            exchange.getResponseHeaders().add("Location", redirectUrl);
            exchange.sendResponseHeaders(HttpURLConnection.HTTP_SEE_OTHER, -1);
        } else {
            exchange.sendResponseHeaders(HttpURLConnection.HTTP_BAD_METHOD, -1);
        }
    }
}
