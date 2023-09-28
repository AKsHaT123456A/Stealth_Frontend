
import "./navbar.css";
import Image from "../../assets/liviso.png";
function Navbar() {
	return (
		<header>
			<img src={Image} alt="logo" className="logo" />
		</header>
	);
}

export default Navbar;