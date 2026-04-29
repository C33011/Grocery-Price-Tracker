package groceriq.models;

public class ListItem {
    private int itemId;
    private int listId;
    private int productId;
    private String productName;
    private int quantity;
    private boolean checked;

    public ListItem(int itemId, int listId, int productId, String productName, int quantity, boolean checked) {
        this.itemId = itemId;
        this.listId = listId;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.checked = checked;
    }

    public int getItemId() { return itemId; }
    public int getListId() { return listId; }
    public int getProductId() { return productId; }
    public String getProductName() { return productName; }
    public int getQuantity() { return quantity; }
    public boolean isChecked() { return checked; }
}
