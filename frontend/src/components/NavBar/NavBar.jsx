import styles from "./NavBar.module.css";
import logo from "@/assets/logos/transparentCutLogo.webp";

import LoginButton from "../auth/LoginButton";
import SignUpButton from "../auth/SignUpButton";
import Pages from "./Pages";

function NavBar() {
  return (
    <nav className={styles.navBar}>
      <img src={logo} alt="LiveNewsAI logo" />

      <Pages />

      <div className={styles.authBlock}>
        <LoginButton />
        <SignUpButton />
      </div>
    </nav>
  );
}

export default NavBar;
