import { ConnectButton } from "@arweave-wallet-kit/react";
import { Link } from "react-router-dom";

const Header = () => {
  const navLinks = [
    {
      title: "View",
      path: "/view",
    },
    {
      title: "Create",
      path: "/create",
    },
  ];
  return (
    <header className="bg-white py-2 px-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-black no-underline">
        <h1 className="m-0 text-3xl font-bold">ArweaveQuery</h1>
      </Link>
      <div>
        {navLinks.map((link) => {
          return (
            <Link key={link.title} to={link.path} className="text-black no-underline mx-2">
              {link.title}
            </Link>
          );
        })}
      </div>
      <ConnectButton
        profileModal={true}
        showBalance={false}
        showProfilePicture={true}
      />
    </header>
  );
};

export default Header;
