package groceriq.models;

public class ShoppingList {
    private int listId;
    private int userId;
    private String listName;
    private String createdAt;
    private boolean isActive;

    public ShoppingList(int listId, int userId, String listName, String createdAt, boolean isActive) {
        this.listId = listId;
        this.userId = userId;
        this.listName = listName;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }

    public int getListId() { return listId; }
    public int getUserId() { return userId; }
    public String getListName() { return listName; }
    public String getCreatedAt() { return createdAt; }
    public boolean isActive() { return isActive; }
}
