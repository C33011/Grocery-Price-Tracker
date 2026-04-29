package groceriq.models;

import java.math.BigDecimal;

public class PriceRecord {
    private int recordId;
    private int productId;
    private int storeId;
    private String storeName;
    private String chain;
    private BigDecimal price;
    private BigDecimal regPrice;
    private boolean isSale;
    private String priceDate;

    public PriceRecord(int recordId, int productId, int storeId, String storeName,
            String chain, BigDecimal price, BigDecimal regPrice, boolean isSale, String priceDate) {
        this.recordId = recordId;
        this.productId = productId;
        this.storeId = storeId;
        this.storeName = storeName;
        this.chain = chain;
        this.price = price;
        this.regPrice = regPrice;
        this.isSale = isSale;
        this.priceDate = priceDate;
    }

    public int getRecordId() { return recordId; }
    public int getProductId() { return productId; }
    public int getStoreId() { return storeId; }
    public String getStoreName() { return storeName; }
    public String getChain() { return chain; }
    public BigDecimal getPrice() { return price; }
    public BigDecimal getRegPrice() { return regPrice; }
    public boolean isSale() { return isSale; }
    public String getPriceDate() { return priceDate; }
}
