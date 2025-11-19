import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link';
import { Card, CardBody, Col, Row } from 'react-bootstrap';

// Dynamically import components that use react-responsive-masonry with SSR disabled
const ShowAll = dynamic(() => import('./ShowAll'), { ssr: false })
const WebDesigner = dynamic(() => import('./WebDesigner'), { ssr: false })
const GraphicDesigner = dynamic(() => import('./GraphicDesigner'), { ssr: false })
const AnimationDesigner = dynamic(() => import('./AnimationDesigner'), { ssr: false })
const UXDesigner = dynamic(() => import('./UXDesigner'), { ssr: false })
const ProductDesigner = dynamic(() => import('./ProductDesigner'), { ssr: false })

const Masonary = () => {
    const [activeTab, setActiveTab] = useState('showall');

    const handledisplay = (catagory: any) => {
        setActiveTab(catagory)
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body border-bottom">
                            <div className="row align-items-center justify-content-between g-3">
                                <div className="col-auto">
                                    <div id="filters" className="btn-filter btns-gallery">
                                        <button className={`btn my-1 btn-sm btn-light-primary me-1 ${activeTab === 'showall' ? 'active' : ''}`} data-filter="*" onClick={() => handledisplay('showall')}>Show all</button>
                                        <button className={`btn my-1 btn-sm btn-light-primary me-1 ${activeTab === 'webdesigner' ? "active" : ""}`} data-filter=".web" onClick={() => handledisplay('webdesigner')}>Web Designer</button>
                                        <button className={`btn my-1 btn-sm btn-light-primary me-1 ${activeTab === 'graphicdesigner' ? 'active' : ''}`} data-filter=".graphic" onClick={() => handledisplay('graphicdesigner')}>Graphic Designer</button>
                                        <button className={`btn my-1 btn-sm btn-light-primary me-1 ${activeTab === 'animationdesigner'}`} data-filter=".animation" onClick={() => handledisplay('animationdesigner')}>Animation Designer</button>
                                        <button className={`btn my-1 btn-sm btn-light-primary me-1 ${activeTab === 'uiuxdesigner'}`} data-filter=".uiux" onClick={() => handledisplay('uiuxdesigner')}>UI/UX Designer</button>
                                        <button className={`btn my-1 btn-sm btn-light-primary me-1 ${activeTab === 'productdesigner'}`} data-filter=".product" onClick={() => handledisplay('productdesigner')}>Product Designer</button>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <ul className="list-inline d-flex align-items-center ms-auto my-1">
                                        <li className="list-inline-item">
                                            <select className="form-select">
                                                <option>Sort By : Newest</option>
                                                <option>Sort By : Newest</option>
                                            </select>
                                        </li>
                                        <li className="list-inline-item align-bottom">
                                            <Link href="#" className="btn btn-primary">My Collection</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="grid row g-3">
                                {activeTab === 'showall' ? <ShowAll /> : ""}
                                {activeTab === 'webdesigner' ? <WebDesigner /> : ""}
                                {activeTab === 'graphicdesigner' ? <GraphicDesigner /> : ""}
                                {activeTab === 'animationdesigner' ? <AnimationDesigner /> : ""}
                                {activeTab === 'uiuxdesigner' ? <UXDesigner /> : ""}
                                {activeTab === 'productdesigner' ? <ProductDesigner /> : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Masonary
