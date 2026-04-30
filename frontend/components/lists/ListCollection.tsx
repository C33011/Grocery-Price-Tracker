import Link from "next/link";
import type { ShoppingList } from "@/types/common";
import SectionHeader from "@/components/shared/SectionHeader";
import styles from "./ListsPage.module.css";

type ListCollectionProps = {
  title: string;
  description: string;
  lists: ShoppingList[];
  archived?: boolean;
  onArchive?: (listId: number) => void;
};

export default function ListCollection({
  title,
  description,
  lists,
  archived = false,
  onArchive,
}: ListCollectionProps) {
  return (
    <section>
      <SectionHeader title={title} description={description} />
      <div className={styles.listGrid}>
        {lists.map((list) => (
          <article className={styles.listCard} key={list.listId}>
            <div>
              <p className={styles.meta}>{archived ? "Archived" : "Active"}</p>
              <h3>{list.listName}</h3>
              <p className={styles.date}>Created {list.createdAt || "recently"}</p>
            </div>
            {archived ? (
              <span className={styles.archivedLabel}>Read only</span>
            ) : (
              <div className={styles.cardActions}>
                <Link className="button-link secondary" href={`/lists/${list.listId}`}>
                  Open
                </Link>
                <button type="button" onClick={() => onArchive?.(list.listId)}>
                  Archive
                </button>
              </div>
            )}
          </article>
        ))}
        {lists.length === 0 && <p className={styles.empty}>Nothing here yet.</p>}
      </div>
    </section>
  );
}
