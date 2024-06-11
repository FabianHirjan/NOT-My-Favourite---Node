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

@WebServlet(name = "PromoteUserServlet", value = "/promote-user-servlet")
public class PromoteUserServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int userId = Integer.parseInt(request.getParameter("userId"));
        toggleUserRole(userId, response);
    }

    private void toggleUserRole(int userId, HttpServletResponse response) throws IOException {
        Connection connection = DatabaseConnection.getConnection();
        try {
            connection.setAutoCommit(false);
            PreparedStatement statement = connection.prepareStatement("SELECT role FROM users WHERE id = ?");
            statement.setInt(1, userId);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                String role = resultSet.getString("role");
                if ("admin".equals(role)) {
                    statement = connection.prepareStatement("UPDATE users SET role = ? WHERE id = ?");
                    statement.setString(1, "user");
                    statement.setInt(2, userId);
                    System.out.printf("User %d demoted to user\n", userId);
                } else {
                    statement = connection.prepareStatement("UPDATE users SET role = ? WHERE id = ?");
                    statement.setString(1, "admin");
                    statement.setInt(2, userId);
                    System.out.printf("User %d promoted to admin\n", userId);
                }
                statement.executeUpdate();
                connection.commit();
                displaySuccessMessage(response);
            }
        } catch (Exception e) {
            try {
                connection.rollback();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
        } finally {
            try {
                connection.setAutoCommit(true);
                connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void displaySuccessMessage(HttpServletResponse response) throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html>");
        out.println("<head>");
        out.println("<title>Action Commited</title>");
        out.println("<meta http-equiv='refresh' content='5;URL=index.jsp'>");
        out.println("<link rel='stylesheet' type='text/css' href='misc/style.css'>");
        out.println("</head>");
        out.println("<body>");
        out.println("<h1>Action Commited</h1>");
        out.println("<p>You'll be redirected to main page in 5 seconds...</p>");
        out.println("</body>");
        out.println("</html>");
    }
}