package groceriq.models;

import java.math.BigDecimal;

public class Product {
    private int productId;
    private String productName;
    private String category;
    private String brand;
    private BigDecimal unitSize;
    private String unitType;

    public Product(int productId, String productName, String category,
            String brand, BigDecimal unitSize, String unitType) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.brand = brand;
        this.unitSize = unitSize;
        this.unitType = unitType;
    }

    public int getProductId() { return productId; }
    public String getProductName() { return productName; }
    public String getCategory() { return category; }
    public String getBrand() { return brand; }
    public BigDecimal getUnitSize() { return unitSize; }
    public String getUnitType() { return unitType; }
}
