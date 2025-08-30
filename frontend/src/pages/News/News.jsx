import styles from "./News.module.css";
import { useState, useEffect } from "react";
import { ENDPOINTS } from "../../api/config";

function News() {
  const [news, setNews] = useState([]);

  async function getAllNews(url = ENDPOINTS.allNews) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAllNews();
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>📰 News are coming soon!</h1>
      <p className={styles.subtitle}>
        Stay tuned — here you’ll find the latest updates and trending stories.
      </p>

      <div>
        <h2>
          Summery:
          {news.map((el, i) => (
            <p key={i}>{el}</p>
          ))}
        </h2>
      </div>

      <div className={styles.cards}>
        {[1, 2, 3].map((item) => (
          <div key={item} className={styles.card}>
            <div className={styles.image}></div>
            <div className={styles.lineWide}></div>
            <div className={styles.lineShort}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;
