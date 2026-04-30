import styles from "./ForumPage.module.css";

type PostComposerProps = {
  title: string;
  body: string;
  onTitleChange: (title: string) => void;
  onBodyChange: (body: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function PostComposer({
  title,
  body,
  onTitleChange,
  onBodyChange,
  onSubmit,
}: PostComposerProps) {
  return (
    <form className={styles.composer} onSubmit={onSubmit}>
      <label>
        <span>Title</span>
        <input
          name="title"
          type="text"
          placeholder="What should shoppers know?"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </label>
      <label>
        <span>Body</span>
        <textarea
          name="body"
          rows={4}
          placeholder="Share a deal, store note, or grocery tip."
          value={body}
          onChange={(event) => onBodyChange(event.target.value)}
        />
      </label>
      <button type="submit">Post</button>
    </form>
  );
}
