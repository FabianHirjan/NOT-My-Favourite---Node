<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="header.jsp" %>
<%@ page import="java.util.List" %>
<%@ page import="java.net.HttpURLConnection" %>
<%@ page import="java.net.URL" %>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="org.example.demo.dto.UserDTO" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Admin</title>
    <link rel="stylesheet" href="misc/style.css">
</head>
<body>
<div class="article" id="topBar">
    <h1>Users</h1>
</div>
<div class="article-container" id="usersContainer">
    <%
        // URL-ul API-ului
        String apiUrl = "http://localhost:8080/demo/api/users";
        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");

        if (conn.getResponseCode() != 200) {
            throw new RuntimeException("HTTP error code : " + conn.getResponseCode());
        }

        BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
        StringBuilder jsonString = new StringBuilder();
        String output;
        while ((output = br.readLine()) != null) {
            jsonString.append(output);
        }
        conn.disconnect();

        // Parsează JSON-ul primit de la API
        Gson gson = new Gson();
        UserDTO[] usersArray = gson.fromJson(jsonString.toString(), UserDTO[].class);
        List<UserDTO> users = java.util.Arrays.asList(usersArray);

        if (users != null) {
            for (UserDTO user : users) {
    %>
    <div class="article">
        <h2><%= user.getName() %></h2>
        <p>Email: <%= user.getEmail() %></p>
        <p>Role: <%= user.getRole() %></p>
        <form action="delete-user-servlet" method="post">
            <input type="hidden" name="userId" value="<%= user.getId() %>">
            <button type="submit">Delete Account</button>
        </form>
        <form action="promote-user-servlet" method="post">
            <input type="hidden" name="userId" value="<%= user.getId() %>">
            <button type="submit"><%= user.getRole().equals("admin") ? "Demote from Admin" : "Promote to Admin" %></button>
        </form>
    </div>
    <%
        }
    } else {
    %>
    <p>No users found.</p>
    <%
        }
    %>
</div>
</body>
</html>
