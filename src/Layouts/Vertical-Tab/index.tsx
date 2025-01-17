/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { changeThemeLayout } from '../../toolkit/thunk';
import { changeSidebarTheme, changeSidebarThemeCaptions } from '../../toolkit/themeLayouts/thunk';
import RightCustomizer from '../RightCustomizer';
import TopBar from '../Topbar';
import Footer from '../Footer';
import SubMenuList from '../SubMenuList';
// import { Link } from 'react-router-dom';
import Link from 'next/link';
import navCardBg from '@assets/images/layout/nav-card-bg.svg'
import logoDark from "@assets/images/logo-dark.svg";
import logoLight from "@assets/images/logo-white.svg";
import avatar1 from "@assets/images/user/avatar-1.jpg"
import SimpleBar from 'simplebar-react';
import NestedMenu from '../NestedMenu';
import { Card, CardBody, Dropdown } from 'react-bootstrap';
import { menuItems } from '../MenuData';
import Image from 'next/image';



const VerticalTab = ({ children, handleOffcanvasToggle, showOffcanvas, themeMode, changeThemeMode, toogleSidebarHide, toogleMobileSidebarHide, themePreset, changeThemePreset, themeLayout, sidebarTheme, sidebarThemeCaptions }: any) => {


    const [isLayoutWidth, setLayoutWidth] = useState(false);

    const handleChangeLayoutWidth = (value: boolean) => {
        setLayoutWidth(value);
    };
    const getLayoutWidth = isLayoutWidth ? "container" : "";

    return (
       <>
            <nav className="pc-sidebar" id="pc-sidebar-hide">
                <div className="navbar-wrapper">
                    <div className="m-header">
                        <Link href="/" className="b-brand text-primary">
                            {themeMode || sidebarTheme === "dark" ?
                                <Image src={logoLight} alt="logo" className="logo-lg landing-logo" />
                                :
                                <Image src={logoDark} alt="logo" className="logo-lg landing-logo" />
                            }
                            <span className="badge bg-brand-color-2 rounded-pill ms-2 theme-version">
                                v1.2.0
                            </span>
                        </Link>
                    </div>

                    <SimpleBar className="navbar-content" style={{ maxHeight: "100vh" }}>
                        <ul className="pc-navbar" id="pc-navbar">

                            <NestedMenu menuItems={menuItems} />
                        </ul>
                        <Card className="nav-action-card bg-brand-color-4">
                            <CardBody
                                style={{ backgroundImage: `url(${navCardBg})` }}
                            >
                                <h5 className="text-dark">Help Center</h5>
                                <p className="text-dark text-opacity-75">
                                    Please contact us for more questions.
                                </p>
                                <Link
                                    href="https://phoenixcoded.support-hub.io/"
                                    className="btn btn-primary"
                                    target="_blank"
                                >
                                    Go to help Center
                                </Link>
                            </CardBody>
                        </Card>
                    </SimpleBar>
                    <Card className="pc-user-card">
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <Image
                                        src={avatar1}
                                        alt="user-image"
                                        className="user-avtar wid-45 rounded-circle"
                                        width={45}
                                    />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <Link href="#" className="arrow-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-offset="0,20"></Link>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0">Jonh Smith</h6>
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
                                                    <li><Dropdown.Item className="pc-user-links">
                                                        <i className="ph-duotone ph-user"></i>
                                                        <span>My Account</span>
                                                    </Dropdown.Item></li>
                                                    <li><Dropdown.Item className="pc-user-links">
                                                        <i className="ph-duotone ph-gear"></i>
                                                        <span>Settings</span>
                                                    </Dropdown.Item></li>
                                                    <li><Dropdown.Item className="pc-user-links">
                                                        <i className="ph-duotone ph-lock-key"></i>
                                                        <span>Lock Screen</span>
                                                    </Dropdown.Item></li>
                                                    <li><Dropdown.Item className="pc-user-links">
                                                        <i className="ph-duotone ph-power"></i>
                                                        <span>Logout</span>
                                                    </Dropdown.Item></li>
                                                </ul>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </nav>
            <TopBar
                handleOffcanvasToggle={handleOffcanvasToggle}
                toogleSidebarHide={toogleSidebarHide}
                toogleMobileSidebarHide={toogleMobileSidebarHide}
                changeThemeMode={changeThemeMode}
            />
            <div className="pc-container">
                <SubMenuList />
                <div className={"pc-content " + getLayoutWidth}>
                    {children}
                </div>
            </div>
            <Footer />
            <RightCustomizer
                showOffcanvas={showOffcanvas}
                handleOffcanvasToggle={handleOffcanvasToggle}
                themeMode={themeMode}
                changeThemeMode={changeThemeMode}
                themePreset={themePreset}
                changeThemePreset={changeThemePreset}
                themeLayout={themeLayout}
                changeThemeLayout={changeThemeLayout}
                isLayoutWidth={isLayoutWidth}
                handleChangeLayoutWidth={handleChangeLayoutWidth}
                sidebarTheme={sidebarTheme}
                changeSidebarTheme={changeSidebarTheme}
                sidebarThemeCaptions={sidebarThemeCaptions}
                changeSidebarThemeCaptions={changeSidebarThemeCaptions}
            />
        </>
    );
};
export default VerticalTab