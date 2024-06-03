package org.example.demo;

import java.io.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import org.example.demo.database.*;


    @WebServlet(name = "RegisterServlet", value = "/register-servlet")
    public class RegisterServlet extends HttpServlet {

        public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
            response.setContentType("text/html");

            String email = request.getParameter("email");
            String password = request.getParameter("password");
            String name = request.getParameter("name");

            try {
                Connection connection = DatabaseConnection.getConnection();
                PreparedStatement statement = connection.prepareStatement("INSERT INTO users (email, name, password) VALUES (?, ?, ?)");
                statement.setString(1, email);
                System.out.printf("email: %s\n", email);
                statement.setString(2, name);
                System.out.printf("name: %s\n", name);
                statement.setString(3, password);
                statement.executeUpdate();


                // Set a session attribute to indicate the user is logged in
                HttpSession session = request.getSession();
                session.setAttribute("loggedIn", true);
                session.setAttribute("name", name);

                // Redirect to index.jsp
                response.sendRedirect("index.jsp");

                statement.close();
                connection.close();
            } catch (Exception e) {
                PrintWriter out = response.getWriter();
                out.println("<html><body>");
                out.println("<p>Error: " + e.getMessage() + "</p>");
                out.println("</body></html>");
            }
        }
    }
