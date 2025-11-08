import { Link } from "react-router-dom";
import "../styles/registro.css";

const Header = () => {
  return (
    <header>
      <Link to="/" className="medTracker">MEDTRACKER</Link>
    </header>
  );
};

export default Header;
