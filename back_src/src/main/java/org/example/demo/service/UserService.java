package org.example.demo.service;

import org.example.demo.database.DatabaseConnection;
import org.example.demo.dto.UserDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class UserService {

    public boolean registerUser(String username, String email, String password) {
        String sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);
            stmt.setString(2, email);
            stmt.setString(3, password);

            int rowsAffected = stmt.executeUpdate();

            return rowsAffected > 0;

        } catch (SQLException ex) {
            ex.printStackTrace();
            return false;
        }
    }

    public boolean loginUser(String email, String password) {
        String sql = "SELECT * FROM users WHERE email = ? AND password = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            stmt.setString(2, password);

            return stmt.executeQuery().next();

        } catch (SQLException ex) {
            ex.printStackTrace();
            return false;
        }
    }


    public boolean userAlreadyExists(String email, String username) {
        String sql = "SELECT * FROM users WHERE email = ? OR name = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            stmt.setString(2, username);

            return stmt.executeQuery().next();

        } catch (SQLException ex) {
            ex.printStackTrace();
            return false;
        }
    }
}