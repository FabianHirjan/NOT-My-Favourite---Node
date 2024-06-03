package org.example.demo;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.demo.database.DatabaseConnection;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@WebServlet(name = "PostServlet", value = "/post-servlet")
public class PostServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String title = request.getParameter("title");
        String content = request.getParameter("content");
        HttpSession session = request.getSession();
        String poster = (String) session.getAttribute("name");
        int stars = Integer.parseInt(request.getParameter("stars"));
        String type = request.getParameter("type");

        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);
        article.setPoster(poster);
        article.setStars(stars);
        article.setType(type);

        // Save the article to the database
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement("INSERT INTO posts (title, content, poster, stars, type) VALUES (?, ?, ?, ?, ?)")) {

            statement.setString(1, article.getTitle());
            statement.setString(2, article.getContent());
            statement.setString(3, article.getPoster());
            statement.setInt(4, article.getStars());
            statement.setString(5, article.getType());

            int rowsInserted = statement.executeUpdate();
            if (rowsInserted > 0) {
                System.out.println("A new article was inserted successfully!");
                displaySuccessMessage(response);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void displaySuccessMessage(HttpServletResponse response) throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html>");
        out.println("<head>");
        out.println("<title>Action Commited</title>");
        out.println("<meta http-equiv='refresh' content='5;URL=index.jsp'>"); // Schimbă 'main-page-url' cu URL-ul paginii principale
        out.println("<link rel='stylesheet' type='text/css' href='misc/style.css'>"); // Asigură-te că calea este corectă
        out.println("</head>");
        out.println("<body>");
        out.println("<h1>Action Commited f</h1>");
        out.println("<p>You'll be redirected to main page in 5 seconds...</p>");
        out.println("</body>");
        out.println("</html>");
    }
}
