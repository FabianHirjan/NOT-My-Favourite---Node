package org.example.demo.servlet;

import org.example.demo.dto.ArticleDTO;
import org.example.demo.dto.CategoryDTO;
import org.example.demo.service.ArticleService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(name = "ArticleServlet", urlPatterns = {"/article-servlet"})
public class ArticleServlet extends HttpServlet {
    private final ArticleService articleService = new ArticleService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String category = request.getParameter("category");
        String type = request.getParameter("type");

        List<ArticleDTO> articles = articleService.getArticlesByTypeAndCategory(type, category);
        request.setAttribute("articles", articles);

        List<CategoryDTO> categories = articleService.getAllCategories();
        request.setAttribute("categories", categories);

        request.getRequestDispatcher("articles.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }
}
