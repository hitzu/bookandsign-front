import Image from 'next/image'
import React from 'react'
import { Col, Container, Row,Button } from 'react-bootstrap'
import headerBackground from '@assets/images/landing/img-header-bg.svg'
import header from '@assets/images/landing/header-main.jpg'
import 'swiper/css';



const HomeSection = () => {
    return (
        <React.Fragment>
            <div className="home container-fluid">
                <div className="bg-dark mx-sm-3 home-section home-section-2">
                    <Image src={headerBackground} alt="background shape" className="img-fluid img-header-bg" />
                    <div className="swiper language-slides-hero">
                        <div className="swiper-wrapper">
                            <div className="swiper-slide">
                                <Row className="align-items-center justify-content-center text-center">
                                    <Col sm={12} className="header-content">
                                        <span className="header-badge text-white">
                                            <i className="ph-duotone ph-medal text-warning me-2"></i>
                                            Unlock Your Potential for Just $9. Limited Offer
                                        </span>
                                        <Row className="justify-content-center text-center">
                                            <Col xl={7} lg={8} md={9} sm={10} xs={11}>
                                                <h1 className="my-3 wow animate__fadeInUp text-white" data-wow-delay="0.4s">Elevate Your Project with
                                                    Light Able Admin Dashboard</h1>
                                            </Col>
                                        </Row>
                                        <Row className="justify-content-center text-center">
                                            <Col xxl={5} xl={6} lg={7} md={8} sm={10} xs={11}>
                                                <p className="f-16 mb-3 wow animate__fadeInUp" data-wow-delay="0.6s">Your go-to solution for
                                                    crafting sleek admin interfaces effortlessly. Streamline your workflow and enhance user
                                                    experience with ease. </p>
                                            </Col>
                                        </Row>
                                        <div className="wow animate__fadeInUp" data-wow-delay="0.8s">
                                            <Button href="#layout-demos" variant="primary" className="me-3">Live Preview <i className="ph-duotone ph-arrow-square-out"></i></Button>
                                            <Button href="https://1.envato.market/EKD9M4" target="_blank" variant="outline-light">Buy Now</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <Container>
                            <Row className="justify-content-center">
                                <Col sm={10}>
                                    <div className="img-header-main">
                                        <Image src={header} alt="img" className="img-fluid" />
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default HomeSection