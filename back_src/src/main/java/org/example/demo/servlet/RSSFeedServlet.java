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

@WebServlet(name = "RSSFeedServlet", urlPatterns = {"/rss-feed"})
public class RSSFeedServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/rss+xml");
        List<ArticleDTO> topArticles = ArticleService.getTopArticles();

        // Generarea fluxului RSS
        try (PrintWriter writer = response.getWriter()) {
            writer.println("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
            writer.println("<rss version=\"2.0\">");
            writer.println("<channel>");
            writer.println("<title>Top Articles</title>");
            writer.println("<link>http://www.example.com</link>");
            writer.println("<description>Top Articles</description>");

            for (ArticleDTO article : topArticles) {
                writer.println("<item>");
                writer.println("<title>" + article.getTitle() + "</title>");
                writer.println("<link>http://www.example.com/view-article?articleId=" + article.getId() + "</link>");
                writer.println("<description>" + article.getContent() + "</description>");
                writer.println("</item>");
            }

            writer.println("</channel>");
            writer.println("</rss>");
        }
    }
}
