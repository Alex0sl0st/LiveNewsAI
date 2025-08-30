import styles from "./NotFound.module.css";

function NotFound() {
  return (
    <section aria-labelledby="nf-title">
      <div className={styles.card}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Page not found</p>
        <p className={styles.desc}>
          The page you’re looking for doesn’t exist or has been moved.
        </p>
      </div>
    </section>
  );
}

export default NotFound;
