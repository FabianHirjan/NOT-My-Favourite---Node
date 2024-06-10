package org.example.demo;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.demo.database.DatabaseConnection;
import org.example.demo.dto.UserDTO;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "ViewUsersServlet", value = "/view-users-servlet")
public class ViewUsersServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<UserDTO> users = getUsers();
        request.setAttribute("users", users);
        request.getRequestDispatcher("/admin.jsp").forward(request, response);
    }

    private List<UserDTO> getUsers() {
        List<UserDTO> users = new ArrayList<>();
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM users")) {
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    UserDTO user = new UserDTO();
                    user.setId(resultSet.getInt("id"));
                    user.setName(resultSet.getString("name"));
                    user.setEmail(resultSet.getString("email"));
                    user.setRole(resultSet.getString("role"));
                    users.add(user);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return users;
    }
}
