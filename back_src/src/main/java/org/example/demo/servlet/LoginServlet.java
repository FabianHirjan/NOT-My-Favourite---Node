package org.example.demo.servlet;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.demo.database.DatabaseConnection;
import com.google.gson.Gson;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet(name = "LoginServlet", value = "/api/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        Gson gson = null;
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM users WHERE email = ? AND password = ?")) {
            statement.setString(1, email);
            statement.setString(2, password);
            ResultSet resultSet = statement.executeQuery();
            PrintWriter out = response.getWriter();
            gson = new Gson();

            if (resultSet.next()) {
                HttpSession session = request.getSession();
                session.setAttribute("loggedIn", true);
                session.setAttribute("name", resultSet.getString("name"));
                session.setAttribute("userId", resultSet.getInt("id"));
                String role = resultSet.getString("role");
                if ("admin".equals(role)) {
                    session.setAttribute("admin", true);
                } else {
                    session.setAttribute("admin", false);
                }

                // Create a response object
                UserResponse userResponse = new UserResponse(resultSet.getString("name"), resultSet.getInt("id"), role);
                String jsonResponse = gson.toJson(userResponse);
                out.print(jsonResponse);
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                ErrorResponse errorResponse = new ErrorResponse("Invalid email or password");
                String jsonResponse = gson.toJson(errorResponse);
                out.print(jsonResponse);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ErrorResponse errorResponse = new ErrorResponse("Internal server error");
            String jsonResponse = gson.toJson(errorResponse);
            PrintWriter out = response.getWriter();
            out.print(jsonResponse);
        }
    }

    class UserResponse {
        private String name;
        private int userId;
        private String role;

        public UserResponse(String name, int userId, String role) {
            this.name = name;
            this.userId = userId;
            this.role = role;
        }
    }

    class ErrorResponse {
        private String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}
