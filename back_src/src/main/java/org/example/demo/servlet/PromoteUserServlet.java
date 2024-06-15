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

import com.google.gson.Gson;

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
                    displaySuccessMessage(response, userId, "user");
                } else {
                    statement = connection.prepareStatement("UPDATE users SET role = ? WHERE id = ?");
                    statement.setString(1, "admin");
                    statement.setInt(2, userId);
                    System.out.printf("User %d promoted to admin\n", userId);
                    displaySuccessMessage(response, userId, "admin");
                }
                statement.executeUpdate();
                connection.commit();
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

    class SuccessResponse {
        private int userId;
        private String newRole;

        public SuccessResponse(int userId, String newRole) {
            this.userId = userId;
            this.newRole = newRole;
        }
    }

    private void displaySuccessMessage(HttpServletResponse response, int userId, String newRole) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();

        SuccessResponse successResponse = new SuccessResponse(userId, newRole);
        String jsonResponse = gson.toJson(successResponse);
        out.print(jsonResponse);
    }

}