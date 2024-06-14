package org.example.demo.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.demo.service.ArticleService;

import java.io.IOException;

@WebServlet(name = "DeleteArticleServlet", value = "/delete-article-servlet")
public class DeleteArticleServlet extends HttpServlet {

    private final ArticleService articleService = new ArticleService();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String articleId = request.getParameter("articleId");
        articleService.deleteArticle(Integer.parseInt(articleId));
        response.sendRedirect("view-user-profile-servlet");
    }
}