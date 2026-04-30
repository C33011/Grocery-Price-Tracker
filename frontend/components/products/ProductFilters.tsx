import type { ProductFilters as ProductFiltersType } from "@/types/products";
import styles from "./ProductsPage.module.css";

type ProductFiltersProps = {
  filters: ProductFiltersType;
  onChange: (filters: ProductFiltersType) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function ProductFilters({ filters, onChange, onSubmit }: ProductFiltersProps) {
  return (
    <form className={styles.filterPanel} onSubmit={onSubmit}>
      <label>
        <span>Search</span>
        <input
          name="search"
          type="text"
          placeholder="Product name"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
      </label>
      <label>
        <span>Category</span>
        <input
          name="category"
          type="text"
          placeholder="Produce, dairy, snacks"
          value={filters.category}
          onChange={(event) => onChange({ ...filters, category: event.target.value })}
        />
      </label>
      <label>
        <span>Chain</span>
        <input
          name="chain"
          type="text"
          placeholder="Store chain"
          value={filters.chain}
          onChange={(event) => onChange({ ...filters, chain: event.target.value })}
        />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}
