package org.example.demo.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.demo.dto.ArticleDTO;
import org.example.demo.dto.CommentDTO;
import org.example.demo.service.ArticleService;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "ExportCSVServlet", urlPatterns = {"/export-csv"})
public class ExportCSVServlet extends HttpServlet {
    private final ArticleService articleService = new ArticleService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"inventar.csv\"");

        List<ArticleDTO> articles = articleService.getAllArticles(); // Obține articolele din serviciu
        List<CommentDTO> comments = articleService.getAllComments(); // Obține comentariile din serviciu

        try (PrintWriter writer = response.getWriter()) {
            writer.println("Articles");
            writer.println("ID,Title,Content,Category,Type,Stars");
            for (ArticleDTO article : articles) {
                writer.println(article.getId() + "," + article.getTitle() + "," + article.getContent() + ","
                        + article.getCategoryName() + "," + article.getType() + "," + article.getStars());
            }

            writer.println("\n");
            writer.println("Comments");
            writer.println("Comment,Poster,Agree,Post_id");
            for (CommentDTO comment : comments) {
                writer.println(comment.getComment() + "," + comment.getPoster() + "," + comment.getAgree() + "," + comment.getPostId());
            }
        }
    }
}
