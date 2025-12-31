import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="pc-footer">
      <div className="footer-wrapper container-fluid">
        <div className="row">
          <div className="col-sm-6 my-1">
            <p className="m-0">
              Made with{" "}
              <a
                href="https://light-able-react-dark.vercel.app/dashboard"
                target="_blank"
              >
                &#9829; by Lusso Tech team
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
