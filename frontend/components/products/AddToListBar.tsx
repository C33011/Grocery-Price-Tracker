import type { ShoppingList } from "@/types/common";
import styles from "./ProductsPage.module.css";

type AddToListBarProps = {
  lists: ShoppingList[];
  selectedCount: number;
  selectedListId: number | "";
  onSelectedListChange: (listId: number | "") => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function AddToListBar({
  lists,
  selectedCount,
  selectedListId,
  onSelectedListChange,
  onSubmit,
}: AddToListBarProps) {
  return (
    <form className={styles.addBar} onSubmit={onSubmit}>
      <div className={styles.addCopy}>
        <strong>{selectedCount} selected</strong>
        <span>Add selected products to a shopping list.</span>
      </div>
      <select
        name="listId"
        value={selectedListId}
        onChange={(event) =>
          onSelectedListChange(event.target.value ? Number(event.target.value) : "")
        }
      >
        <option value="" disabled>
          Select a list
        </option>
        {lists.map((list) => (
          <option key={list.listId} value={list.listId}>
            {list.listName}
          </option>
        ))}
      </select>
      <button type="submit">Add to list</button>
    </form>
  );
}
