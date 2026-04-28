package groceriq.models;

import java.math.BigDecimal;

public class PriceAlert {
    private final int productId;
    private final String productName;
    private final String brand;
    private final String category;
    private final String storeName;
    private final String chain;
    private final BigDecimal currentPrice;
    private final BigDecimal avgPrice;
    private final double pctBelowAvg;

    public PriceAlert(int productId, String productName, String brand, String category,
                String storeName, String chain, BigDecimal currentPrice,
                BigDecimal avgPrice, double pctBelowAvg) {
            this.productId = productId;
            this.productName = productName;
            this.brand = brand;
            this.category = category;
            this.storeName = storeName;
            this.chain = chain;
            this.currentPrice = currentPrice;
            this.avgPrice = avgPrice;
            this.pctBelowAvg = pctBelowAvg;
        }
    
    public int getProductId(){
        return productId;
    }

    public String getProductName(){
        return productName;
    }

    public String getBrand(){
        return brand;
    }

    public String getCategory(){
        return category;
    }

    public String getStoreName(){
        return storeName;
    }

    public String getChain(){
        return chain;
    }

    public BigDecimal getCurrentPrice(){
        return currentPrice;
    }

    public BigDecimal getAvgPrice(){
        return avgPrice;
    }

    public double getPctBelowAvg(){
        return pctBelowAvg;
    }

}
