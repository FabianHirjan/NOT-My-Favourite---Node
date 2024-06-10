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

@WebServlet(name = "ArticleApiServlet", urlPatterns = {"/api/articles"})
public class ArticleApiServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        List<ArticleDTO> articles = ArticleService.getAllArticles();

        // Conversie articole la JSON și scriere răspuns
        try (PrintWriter writer = response.getWriter()) {
            writer.println("[");
            for (int i = 0; i < articles.size(); i++) {
                ArticleDTO article = articles.get(i);
                writer.println("{");
                writer.println("\"id\": " + article.getId() + ",");
                writer.println("\"title\": \"" + article.getTitle() + "\",");
                writer.println("\"content\": \"" + article.getContent() + "\",");
                writer.println("\"category\": \"" + article.getCategoryName() + "\",");
                writer.println("\"stars\": " + article.getStars() + ",");
                writer.println("\"type\": \"" + article.getType() + "\"");
                writer.println("}" + (i < articles.size() - 1 ? "," : ""));
            }
            writer.println("]");
        }
    }
}
