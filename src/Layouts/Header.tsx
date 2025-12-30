import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import logoDark from "@assets/images/logo-dark.png";
import logoLight from "@assets/images/logo-white.png";
import SimpleBar from "simplebar-react";
import { menuItems } from "./MenuData";
import NestedMenu from "./NestedMenu";
import { Dropdown } from "react-bootstrap";
import { useAuthStore } from "../stores/authStore";

const Header = ({ themeMode, sidebarTheme }: any) => {
  const userInfo = useAuthStore((state) => state.userInfo);
  const [userName, setUserName] = useState("");

  const router = useRouter();
  const { clearUserInfo } = useAuthStore((state) => state);

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.firstName);
    }
  }, [userInfo]);

  const handleLogout = () => {
    clearUserInfo();
    router.push("/login");
  };

  return (
    <nav className="pc-sidebar" id="pc-sidebar-hide">
      <div className="navbar-wrapper">
        <div className="m-header d-flex justify-content-center">
          <Link href="/" className="b-brand text-primary">
            <Image
              src={logoLight}
              alt="logo"
              className="logo-lg landing-logo"
              priority={true}
              width={50}
              height={50}
            />
          </Link>
        </div>
        {/* <div className="navbar-content"> */}
        <SimpleBar className="navbar-content" style={{ maxHeight: "100vh" }}>
          <ul className="pc-navbar" id="pc-navbar">
            {/* Sidebar  */}
            <NestedMenu menuItems={menuItems} />
          </ul>
        </SimpleBar>
        {/* </div> */}
        <div className="card pc-user-card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0"></div>
              <div className="flex-grow-1 ms-3 me-2">
                <h6 className="mb-0">{userName}</h6>
                <small>Administrator</small>
              </div>
              <Dropdown>
                <Dropdown.Toggle
                  variant="a"
                  className="btn btn-icon btn-link-secondary avtar arrow-none"
                  data-bs-offset="0,20"
                >
                  <i className="ph-duotone ph-windows-logo"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <ul>
                    <li>
                      <Dropdown.Item className="pc-user-links">
                        <i className="ph-duotone ph-user"></i>
                        <span>My Account</span>
                      </Dropdown.Item>
                    </li>
                    <li>
                      <Dropdown.Item className="pc-user-links">
                        <i className="ph-duotone ph-gear"></i>
                        <span>Settings</span>
                      </Dropdown.Item>
                    </li>
                    <li>
                      <Dropdown.Item className="pc-user-links">
                        <i className="ph-duotone ph-lock-key"></i>
                        <span>Lock Screen</span>
                      </Dropdown.Item>
                    </li>
                    <li onClick={handleLogout}>
                      <Dropdown.Item className="pc-user-links">
                        <i className="ph-duotone ph-power"></i>
                        <span>Logout</span>
                      </Dropdown.Item>
                    </li>
                  </ul>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
