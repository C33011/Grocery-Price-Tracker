import styles from "./ListsPage.module.css";

type CreateListFormProps = {
  listName: string;
  onListNameChange: (listName: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function CreateListForm({
  listName,
  onListNameChange,
  onSubmit,
}: CreateListFormProps) {
  return (
    <form className={styles.createForm} onSubmit={onSubmit}>
      <label>
        <span>New list</span>
        <input
          name="listName"
          type="text"
          placeholder="Weekly essentials"
          value={listName}
          onChange={(event) => onListNameChange(event.target.value)}
          required
        />
      </label>
      <button type="submit">Create list</button>
    </form>
  );
}
