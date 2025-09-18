import styles from "./News.module.css";
import { useState, useEffect } from "react";
import { ENDPOINTS } from "../../api/config";

function News() {
  const [news, setNews] = useState([]);

  const [newsSummery, setNewsSummery] = useState("");

  async function updateNewsSummery(url = ENDPOINTS.chatGptAPI) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newsText: news
            ? news.reduce(
                (acc, curr) => acc + "\n\n" + JSON.stringify(curr),
                ""
              )
            : "",
        }),
      });

      if (!res.ok) {
        throw new Error("Помилка при відправці новин");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("❌ Fetch error:", err);
      return null;
    }
  }

  async function getAllNews(url = ENDPOINTS.allNews) {
    try {
      const res = await fetch(url);

      if (!res.ok) {
        setNews([]);
        throw new Error("Failed to fetch news");
      }
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
        <h2>Summery:</h2>
        {news && news.map((el, i) => <p key={i}>{el.content}</p>)}

        <h1>Short summery:</h1>
        <button
          onClick={() =>
            updateNewsSummery().then((summery) => setNewsSummery(summery))
          }
        >
          Update summery
        </button>
        <p>{newsSummery}</p>
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
