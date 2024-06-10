<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<body>
<h2>RSS Feed Display</h2>
<div id="rssOutput">Loading...</div>
<script>
    fetch('/most-desired-articles-rss-servlet')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            let items = data.querySelectorAll('item');
            let html = `<ul>`;
            items.forEach(el => {
                html += `<li><a href="${el.querySelector('link').innerHTML}">${el.querySelector('title').innerHTML}</a></li>`;
            });
            html += `</ul>`;
            document.getElementById('rssOutput').innerHTML = html;
        });
</script>
</body>
</html>
