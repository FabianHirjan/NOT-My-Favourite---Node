package org.example.demo.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.demo.database.DatabaseConnection;
import org.example.demo.dto.ArticleDTO;
import org.example.demo.service.ArticleService;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

@WebServlet(name = "ApproveArticleServlet", value = "/approve-article-servlet")
public class ApproveArticleServlet extends HttpServlet {


    private final ArticleService articleService = new ArticleService();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String articleId = request.getParameter("articleId");
        articleService.approveArticle(Integer.parseInt(articleId));
        response.sendRedirect("article-servlet");
    }
}