package org.example.demo;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import org.example.demo.database.*;

@WebServlet(name = "DeleteUserServlet", value = "/delete-user-servlet")
public class DeleteUserServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int userId = Integer.parseInt(request.getParameter("userId"));
        deleteUser(userId, response);
    }

    private void deleteUser(int userId, HttpServletResponse response) throws IOException {
        Connection connection = DatabaseConnection.getConnection();
        try {
            connection.setAutoCommit(false);
            connection.createStatement().execute("DELETE FROM users WHERE id = " + userId);
            connection.commit();
            displaySuccessMessage(response);
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