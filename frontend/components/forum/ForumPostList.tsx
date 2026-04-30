import type { ForumPost } from "@/types/forum";
import SectionHeader from "@/components/shared/SectionHeader";
import styles from "./ForumPage.module.css";

type ForumPostListProps = {
  posts: ForumPost[];
};

export default function ForumPostList({ posts }: ForumPostListProps) {
  return (
    <section>
      <SectionHeader
        title="Posts"
        description={`${posts.length} community updates from grocery trackers.`}
      />
      <div className={styles.postList}>
        {posts.map((post) => (
          <article className={styles.postCard} key={post.postId}>
            <div className={styles.postHeader}>
              <h3>{post.title}</h3>
              <p>
                {post.username} at {post.postedAt}
              </p>
            </div>
            <p className={styles.postBody}>{post.body}</p>
          </article>
        ))}
        {posts.length === 0 && <p className={styles.empty}>No posts yet.</p>}
      </div>
    </section>
  );
}
