package org.example.demo.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.demo.database.DatabaseConnection;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet(name = "LoginServlet", value = "/api/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String contentType = request.getContentType();
        if (contentType != null && contentType.contains("application/json")) {
            handleJsonRequest(request, response);
        } else {
            handleFormRequest(request, response);
        }
    }

    private void handleJsonRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        Gson gson = new Gson();
        BufferedReader reader = request.getReader();
        PrintWriter out = response.getWriter();
        LoginRequest loginRequest;

        try {
            loginRequest = gson.fromJson(reader, LoginRequest.class);
        } catch (JsonSyntaxException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            ErrorResponse errorResponse = new ErrorResponse("Invalid JSON format");
            String jsonResponse = gson.toJson(errorResponse);
            out.print(jsonResponse);
            return;
        }

        try {
            authenticateUser(loginRequest.getEmail(), loginRequest.getPassword(), request, response, gson);
        } catch (ServletException e) {
            throw new RuntimeException(e);
        }
    }

    private void handleFormRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        Gson gson = new Gson();
        try {
            authenticateUser(email, password, request, response, gson);
        } catch (ServletException e) {
            throw new RuntimeException(e);
        }
    }

    private void authenticateUser(String email, String password, HttpServletRequest request, HttpServletResponse response, Gson gson) throws IOException, ServletException {
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM users WHERE email = ? AND password = ?")) {
            statement.setString(1, email);
            statement.setString(2, password);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                HttpSession session = request.getSession();
                session.setAttribute("loggedIn", true);
                session.setAttribute("name", resultSet.getString("name"));
                session.setAttribute("userId", resultSet.getInt("id"));
                String role = resultSet.getString("role");
                session.setAttribute("admin", "admin".equals(role));

                if (request.getContentType() != null && request.getContentType().contains("application/json")) {
                    UserResponse userResponse = new UserResponse(resultSet.getString("name"), resultSet.getInt("id"), role);
                    String jsonResponse = gson.toJson(userResponse);
                    response.setStatus(HttpServletResponse.SC_OK);
                    PrintWriter out = response.getWriter();
                    out.print(jsonResponse);
                } else {
                    response.sendRedirect("../index.jsp");
                }
            } else {
                if (request.getContentType() != null && request.getContentType().contains("application/json")) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    ErrorResponse errorResponse = new ErrorResponse("Invalid email or password");
                    String jsonResponse = gson.toJson(errorResponse);
                    PrintWriter out = response.getWriter();
                    out.print(jsonResponse);
                } else {
                    request.setAttribute("errorMessage", "Invalid email or password");
                    request.getRequestDispatcher("login.jsp").forward(request, response);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            if (request.getContentType() != null && request.getContentType().contains("application/json")) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                ErrorResponse errorResponse = new ErrorResponse("Internal server error");
                String jsonResponse = gson.toJson(errorResponse);
                PrintWriter out = response.getWriter();
                out.print(jsonResponse);
            } else {
                request.setAttribute("errorMessage", "Internal server error");
                request.getRequestDispatcher("login.jsp").forward(request, response);
            }
        }
    }

    class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public String getPassword() {
            return password;
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
