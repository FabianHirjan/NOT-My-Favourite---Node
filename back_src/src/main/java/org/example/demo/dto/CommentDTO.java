package org.example.demo.dto;

public class CommentDTO {
    private int id;
    private int postId;
    private String comment;
    private String poster;
    private String agree;

    // Getters și Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getPostId() {
        return postId;
    }

    public void setPostId(int postId) {
        this.postId = postId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public String getAgree() {
        return agree;
    }

    public void setAgree(String agree) {
        this.agree = agree;
    }
}
