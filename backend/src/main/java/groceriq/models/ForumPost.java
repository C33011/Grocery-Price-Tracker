package groceriq.models;

public class ForumPost {
    private int postId;
    private int userId;
    private String username;
    private String title;
    private String body;
    private String postedAt;

    public ForumPost(int postId, int userId, String username, String title, String body, String postedAt) {
        this.postId = postId;
        this.userId = userId;
        this.username = username;
        this.title = title;
        this.body = body;
        this.postedAt = postedAt;
    }

    public int getPostId() { return postId; }
    public int getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getTitle() { return title; }
    public String getBody() { return body; }
    public String getPostedAt() { return postedAt; }
}
