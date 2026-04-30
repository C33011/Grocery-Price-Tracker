import type { Product } from "@/types/common";
import styles from "./ListDetailPage.module.css";

type AddItemFormProps = {
  products: Product[];
  productId: number | "";
  quantity: number;
  onProductChange: (productId: number | "") => void;
  onQuantityChange: (quantity: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function AddItemForm({
  products,
  productId,
  quantity,
  onProductChange,
  onQuantityChange,
  onSubmit,
}: AddItemFormProps) {
  return (
    <form className={styles.addForm} onSubmit={onSubmit}>
      <label>
        <span>Product</span>
        <select
          name="productId"
          value={productId}
          onChange={(event) => onProductChange(event.target.value ? Number(event.target.value) : "")}
        >
          <option value="" disabled>
            Select a product
          </option>
          {products.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.productName}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Qty</span>
        <input
          name="quantity"
          type="number"
          value={quantity}
          min="1"
          onChange={(event) => onQuantityChange(Number(event.target.value))}
        />
      </label>
      <button type="submit">Add item</button>
    </form>
  );
}
