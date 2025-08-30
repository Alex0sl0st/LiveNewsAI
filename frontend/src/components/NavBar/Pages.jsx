import "@/App.css";
import styles from "./Pages.module.css";
import { NavLink } from "react-router-dom";

function Pages() {
  const getClassesForNavLink = ({ isActive }) => {
    return isActive ? `${styles.activeNavLink}` : "";
  };
  return (
    <ul className={`${styles.pagesBlock} unsetA`}>
      <li>
        <NavLink to="/" className={getClassesForNavLink}>
          News
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className={getClassesForNavLink}>
          About
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className={getClassesForNavLink}>
          Contact
        </NavLink>
      </li>
    </ul>
  );
}

export default Pages;
