import { ConnectButton } from "@arweave-wallet-kit/react";
import { Link } from "react-router-dom";

const Header = () => {
  const navLinks = [
    {
      title: "View Posts",
      path: "/view",
    },
    {
      title: "Create Post",
      path: "/create",
    },
  ];
  return (
    <header className="py-2 px-4 flex justify-between items-center shadow-md z-10">
      <Link to="/" className="no-underline">
        <h1 className="m-0 text-2xl font-bold">ArweaveQuery</h1>
      </Link>
      <div className="flex gap-10">
        {navLinks.map((link) => {
          return (
            <Link key={link.title} to={link.path} className="no-underline text-lg p-4 ">
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
