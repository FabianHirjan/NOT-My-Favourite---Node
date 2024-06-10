package org.example.demo.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.demo.dto.CategoryDTO;
import org.example.demo.database.DatabaseConnection;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "PostServlet", value = "/post-servlet")
public class PostServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Obțineți categoriile din baza de date și setați-le în request
        List<CategoryDTO> categories = getCategoryListFromDatabase();
        request.setAttribute("categories", categories);

        // Redirecționați către pagina post.jsp
        request.getRequestDispatcher("post.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Obțineți datele din formular
        String title = request.getParameter("title");
        String content = request.getParameter("content");
        String category = request.getParameter("category");
        String stars = request.getParameter("stars");
        String type = request.getParameter("type");

        HttpSession session = request.getSession();
        String poster = (String) session.getAttribute("name");

        // Validare simplă
        if (title == null || content == null || category == null || stars == null || type == null || poster == null) {
            request.setAttribute("errorMessage", "Toate câmpurile sunt obligatorii.");
            request.getRequestDispatcher("post.jsp").forward(request, response);
            return;
        }

        // Salvează articolul în baza de date
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(
                     "INSERT INTO posts (title, content, poster, stars, type, category_id, approved) VALUES (?, ?, ?, ?, ?, ?, 0)")) {
            statement.setString(1, title);
            statement.setString(2, content);
            statement.setString(3, poster); // Numele utilizatorului
            statement.setInt(4, Integer.parseInt(stars));
            statement.setString(5, type);
            statement.setInt(6, Integer.parseInt(category));
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            request.setAttribute("errorMessage", "A apărut o eroare la salvarea articolului.");
            request.getRequestDispatcher("post.jsp").forward(request, response);
            return;
        }

        // Redirecționați utilizatorul la o pagină de succes sau la lista de articole
        response.sendRedirect("article-servlet?type=" + type + "&category=" + category);
    }

    private List<CategoryDTO> getCategoryListFromDatabase() {
        List<CategoryDTO> categories = new ArrayList<>();
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT id, name FROM categories")) {

            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                CategoryDTO category = new CategoryDTO();
                category.setId(resultSet.getInt("id"));
                category.setName(resultSet.getString("name"));
                categories.add(category);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return categories;
    }
}
