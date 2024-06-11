package org.example.demo.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.demo.dto.CategoryDTO;
import org.example.demo.service.ArticleService;

import java.io.IOException;
import java.util.List;

@WebServlet(name = "PostServlet", value = "/post-servlet")
public class PostServlet extends HttpServlet {
    private final ArticleService articleService = new ArticleService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Obțineți categoriile folosind ArticleService și setați-le în request
        List<CategoryDTO> categories = articleService.getAllCategories();
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

        // Salvează articolul folosind ArticleService
        try {
            boolean success = articleService.saveArticle(title, content, poster, Integer.parseInt(stars), type, Integer.parseInt(category));
            if (!success) {
                throw new Exception("Failed to save article");
            }
        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("errorMessage", "A apărut o eroare la salvarea articolului.");
            request.getRequestDispatcher("post.jsp").forward(request, response);
            return;
        }

        // Redirecționați utilizatorul la o pagină de succes sau la lista de articole
        response.sendRedirect("article-servlet?type=" + type + "&category=" + category);
    }
}
