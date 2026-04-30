import type { ListItem } from "@/types/list-detail";
import SectionHeader from "@/components/shared/SectionHeader";
import styles from "./ListDetailPage.module.css";

type ListItemCollectionProps = {
  items: ListItem[];
  onToggle: (itemId: number, checked: boolean) => void;
  onRemove: (itemId: number) => void;
};

export default function ListItemCollection({
  items,
  onToggle,
  onRemove,
}: ListItemCollectionProps) {
  return (
    <section>
      <SectionHeader
        title="Items"
        description={`${items.length} products in this grocery list.`}
      />
      <div className={styles.itemList}>
        {items.map((item) => (
          <article className={`${styles.itemCard} ${item.checked ? styles.checked : ""}`} key={item.itemId}>
            <div className={styles.itemMain}>
              <label className={styles.checkControl}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => onToggle(item.itemId, !item.checked)}
                />
                <span>{item.checked ? "Checked" : "Needed"}</span>
              </label>
              <div>
                <h3>{item.productName}</h3>
                <p>Quantity {item.quantity}</p>
              </div>
            </div>
            <button type="button" onClick={() => onRemove(item.itemId)}>
              Remove
            </button>
          </article>
        ))}
        {items.length === 0 && <p className={styles.empty}>No items in this list yet.</p>}
      </div>
    </section>
  );
}
