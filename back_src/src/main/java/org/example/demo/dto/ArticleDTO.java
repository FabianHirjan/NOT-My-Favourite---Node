package org.example.demo.dto;

public class ArticleDTO {
    private int id;
    private String title;
    private String content;
    private String poster;
    private int stars;
    private int isApproved;
    private String type;
    private String categoryName;


    public String getType() {
        return type;
    }



    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getId() {
        return id;
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

    public int getIsApproved() {
        return isApproved;
    }

    public void setId(int id) {
        this.id = id;
    }

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

    public void setIsApproved(int isApproved) {
        this.isApproved = isApproved;
    }
}
