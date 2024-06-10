package org.example.demo.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private static final String DATABASE_URL = "jdbc:mysql://127.0.0.1:3306/city?useSSL=false&serverTimezone=UTC";
    private static final String DATABASE_USER = "root";
    private static final String DATABASE_PASSWORD = "";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    public static Connection getConnection() {
        Connection connection = null;
        try {
            connection = DriverManager.getConnection(DATABASE_URL, DATABASE_USER, DATABASE_PASSWORD);
        } catch (SQLException e) {
            System.out.println("Eroare la conectarea la baza de date: " + e.getMessage());
        }
        return connection;
    }

    public void hasConnection() {
        Connection connection = getConnection();
        if (connection != null) {
            System.out.println("Conectare la baza de date reusita!");
        } else {
            System.out.println("Conectare la baza de date esuata!");
        }
    }
}