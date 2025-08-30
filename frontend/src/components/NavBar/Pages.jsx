import styles from "./Pages.module.css";
import "@/App.css";

function Pages() {
  return (
    <ul className={`${styles.pagesBlock} unsetA`}>
      <li>
        <a href="#">News</a>
      </li>
      <li>
        <a href="#">About Us</a>
      </li>
      <li>
        <a href="#">Contact</a>
      </li>
    </ul>
  );
}

export default Pages;
