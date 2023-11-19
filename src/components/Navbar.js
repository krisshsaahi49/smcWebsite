import Link from "next/link";
import Image from "next/image";

const NavbarCustom = () => {

	    const handleManageEventsClick = (event) => {
    // Prevent default behavior of the <Link> component
    event.preventDefault();

    const manageEventsSection = document.getElementById("manage-events-section");
    if (manageEventsSection) {
      manageEventsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

	return (
	  <nav className="bg-transparent py-1 fixed top-0 w-full z-50">
		<div className="container mx-auto flex items-center justify-between">
		  <div>
			<Image
			  src="/LogoPFW.webp"
			  width={150}
			  height={30}
			  alt="Logo"
			  className="cursor-pointer"
			/>
		  </div>
		  <ul className="flex list-none m-0 space-x-8">
			<li>
			  <Link href="/" className="text-white hover:text-gray-200" onClick={handleManageEventsClick}>
				Home
			  </Link>
			</li>
			<li>
			  <Link href="#manage-events-section" className="text-white hover:text-gray-200" onClick={handleManageEventsClick}>   
				Manage Events
			  </Link>
			</li>
			<li>
			  <Link href="/schedule" className="text-white hover:text-gray-200">
				Schedules
			  </Link>
			</li>
			<li>
			  <Link href="/gear" className="text-white hover:text-gray-200">
				Gear
			  </Link>
			</li>
			<li>
			  <Link href="/contact" className="text-white hover:text-gray-200">
				Contact Us
			  </Link>
			</li>
		  </ul>
		</div>
	  </nav>
	);
  };
  
  export default NavbarCustom;
  