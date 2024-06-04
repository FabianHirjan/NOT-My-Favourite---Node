package org.example.demo;

import java.io.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import org.example.demo.database.*;


@WebServlet(name = "LoginServlet", value = "/login-servlet")
public class LoginServlet extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        try {
            Connection connection = DatabaseConnection.getConnection();
            PreparedStatement statement = connection.prepareStatement("SELECT * FROM users WHERE email = ? AND password = ?");
            statement.setString(1, email);
            statement.setString(2, password);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                HttpSession session = request.getSession();
                session.setAttribute("loggedIn", true);

                // Store the user's name in the session
                String name = resultSet.getString("name");
                session.setAttribute("name", name);

                String role = resultSet.getString("role");
                if(role != null){
                if(role.equals("admin")) {
                    session.setAttribute("admin", true);
                }
                }

                // Redirect to index.jsp
                response.sendRedirect("index.jsp");
            } else {
                PrintWriter out = response.getWriter();
                out.println("<html><body>");
                out.println("<h1>Invalid email or password.</h1>");
                out.println("</body></html>");
            }

            resultSet.close();
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