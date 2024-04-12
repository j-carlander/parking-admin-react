import { Navbar } from "../Navbar/Navbar";
import './Header.css';

export function Header() {
  return (
    <header>
      <h1>
        <img
        className="header-logo"
          src="/lindskrog_logo.png"
          alt="Lindskrog Logo"
          aria-label="Lindskrog"
        />
      </h1>
      <Navbar />
    </header>
  );
}
