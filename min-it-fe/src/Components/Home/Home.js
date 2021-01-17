import React from 'react';
import { withRouter } from 'react-router';
import history from '../../history';

// Pictures
import hero from './hero-img.png';
import ibm from './ibmlogo.png';
import vonage from './vonagelogo.png';


function Home(props) {

    return (
        <div className="Home">
            <section id="hero" className="d-flex align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 pt-5 pt-lg-0 order-2 order-lg-1 d-flex flex-column justify-content-center">
                            <h1 data-aos="fade-up">Grow your business with min.it</h1>
                            <h2 data-aos="fade-up" data-aos-delay="400">Enter your Meeting ID below</h2>
                            <div data-aos="fade-up" data-aos-delay="800">
                                <form method = "get" action="document.html">
                                    <input type="text" className="searchbox__input" placeholder = "Enter Meeting ID" id='meetingID' autoComplete='off' />
                                    <i className="fa fa-search" onClick={()=>{
                                        let id = document.getElementById('meetingID').value;
                                        
                                        // Send meeting ID to WSS
                                        console.log(id);
                                        props.ws.send(JSON.stringify({'clientType': 'meeting-creator', 'meetingID': id}));

                                        // Generate doc key
                                        let docKey = '';
                                        let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                                        for (let i = 0; i < 10; i++) {
                                            docKey += charset.charAt(Math.floor(Math.random() * charset.length));
                                        }
                                        history.push('/docs/' + docKey);
                                    }}></i>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6 order-1 order-lg-2 hero-img" data-aos="fade-left" data-aos-delay="200">
                            <img src={ hero } className="img-fluid animated" alt="" />
                        </div>
                    </div>
                </div>

            </section>

            <main id="main">

                
                <section id="clients" className="clients clients">
                <div className="container">

                    <div className="row">

                    <div className="col-sm-6">
                        <img src={ ibm } className="img-fluid" alt="" data-aos="zoom-in" />
                    </div>

                    <div className="col-sm-6">
                        <img src={ vonage } className="img-fluid" alt="" data-aos="zoom-in" data-aos-delay="100" />
                    </div>

                    

                    </div>

                </div>
                </section>


                <section id="about" className="about">
                <div className="container">

                    <div className="section-title" data-aos="fade-up">
                    <h2>About Us</h2>
                    </div>

                    <div className="row content">
                    <div className="col-lg-6" data-aos="fade-up" data-aos-delay="150">
                        <p>
                        min.it dials into your meeting to seamlessly create meeting minutes and summarize key points. 
                        </p>
                        <ul>
                        <li><i className="ri-check-double-line"></i> Convenient: As long as you have access to the internet, you can use min.it without breaking your routine</li>
                        <li><i className="ri-check-double-line"></i> Efficient: With a click of a button, your meeting can be recorded and meeting minutes will be generated</li>
                        <li><i className="ri-check-double-line"></i> Impactful: By using min.it, individuals can save time and have more engaging meeting experiences </li>
                        </ul>
                    </div>
                    <div className="col-lg-6 pt-4 pt-lg-0" data-aos="fade-up" data-aos-delay="300">
                        <p>
                        min.it is dedicated to helping individuals worldwide improve meeting efficiency by dialing into your meeting and outputting all the relevant information into condensed meeting minutes in real time. The solution incorporates WebSockets, NLP, and Databases in conjunction with the IBM Cloud and Vonage Communications API.
                        </p>
                        <a href="#" className="btn-learn-more">Learn More</a>
                    </div>
                    </div>

                </div>
                </section>

                
                <section id="counts" className="counts">
                <div className="container">

                    <div className="row">
                    <div className="image col-xl-5 d-flex align-items-stretch justify-content-center justify-content-xl-start" data-aos="fade-right" data-aos-delay="150">
                        <img src="assets/img/counts-img.svg" alt="" className="img-fluid" />
                    </div>

                    <div className="col-xl-7 d-flex align-items-stretch pt-4 pt-xl-0" data-aos="fade-left" data-aos-delay="300">
                        <div className="content d-flex flex-column justify-content-center">
                        <div className="row">
                            <div className="col-md-6 d-md-flex align-items-md-stretch">
                            <div className="count-box">
                                <i className="icofont-simple-smile"></i>
                                <span data-toggle="counter-up">100</span>
                                <p><strong>Happy Clients</strong> worldwide, including demographics ranging from businesses and students.</p>
                            </div>
                            </div>

                            <div className="col-md-6 d-md-flex align-items-md-stretch">
                            <div className="count-box">
                                <i className="icofont-document-folder"></i>
                                <span data-toggle="counter-up">7</span>
                                <p><strong>Projects</strong> aiding users with different challenges.</p>
                            </div>
                            </div>

                            <div className="col-md-6 d-md-flex align-items-md-stretch">
                            <div className="count-box">
                                <i className="icofont-clock-time"></i>
                                <span data-toggle="counter-up">12</span>
                                <p><strong>Years of experience</strong> developing and working with technical solutions.</p>
                            </div>
                            </div>

                            <div className="col-md-6 d-md-flex align-items-md-stretch">
                            <div className="count-box">
                                <i className="icofont-award"></i>
                                <span data-toggle="counter-up">5</span>
                                <p><strong>Awards</strong> for innovative solutions aiding businesses after an increase in virtual meetings.</p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </section>
            </main>
            <footer id="footer">
                <div className="container">
                <div className="row d-flex align-items-center">
                    <div className="col-lg-6 text-lg-left text-center">
                    <div className="copyright">
                        &copy; Copyright <strong>min.it</strong>. All Rights Reserved
                    </div>
                    <div className="credits">
                        
                    </div>
                    </div>
                    <div className="col-lg-6">
                    <nav className="footer-links text-lg-right text-center pt-2 pt-lg-0">
                        <a href="#intro" className="scrollto">Home</a>
                        <a href="#about" className="scrollto">About</a>
                    
                    </nav>
                    </div>
                </div>
                </div>
            </footer>
        </div>
    );
}

export default withRouter(Home);
