package org.example.demo;


public class Article {
    private String title;
    private String content;
    private String poster;
    private int stars;
    private String type;

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public String getPoster() {
        return poster;
    }

    public int getStars() {
        return stars;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
