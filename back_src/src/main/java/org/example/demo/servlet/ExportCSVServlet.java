package org.example.demo.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.demo.dto.ArticleDTO;
import org.example.demo.service.ArticleService;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "ExportCSVServlet", urlPatterns = {"/export-csv"})
public class ExportCSVServlet extends HttpServlet {
    private final ArticleService articleService = new ArticleService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Setare tip de conținut pentru CSV
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"inventar.csv\"");

        List<ArticleDTO> articles = articleService.getAllArticles(); // Obține articolele din serviciu

        // Scriere date CSV
        try (PrintWriter writer = response.getWriter()) {
            writer.println("ID,Title,Content,Category,Type,Stars");
            for (ArticleDTO article : articles) {
                writer.println(article.getId() + "," + article.getTitle() + "," + article.getContent() + ","
                        + article.getCategoryName() + "," + article.getType() + "," + article.getStars());
            }
        }
    }
}
