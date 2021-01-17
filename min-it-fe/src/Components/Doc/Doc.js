import { React, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { useLocation } from 'react-router-dom';
import firebase from 'firebase';

import TextArea from './TextArea';


function Doc(props) {
    const [connected, setConnected] = useState(false);
    const path = useLocation().pathname
    if (!connected) {
        var docKey = path.substring(path.lastIndexOf('/')+1);
        setTimeout(() => {props.ws.send(JSON.stringify({'docKey' : docKey}))}, 2000);
        setConnected(true);
    }
    return (
        <div className="Doc">
            <main id="main">
                <section id="breadcrumbs" className="breadcrumbs">
                <div className="container">

                    <div className="d-flex justify-content-between align-items-center">
                    <h2>Meeting Minutes</h2>
                    <ol>
                        <li><a href="index.html">Home</a></li>
                        <li>Meeting Minutes</li>
                    </ol>
                    </div>

                </div>
                </section>

                <section id="portfolio-details" className="portfolio-details">
                <div className="container">

                    <div className="row">

                    <div id='docContainer'>
                        <TextArea notes={props.notes} handleChange={props.handleChange} />
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
                    <a href="index.html" className="scrollto">Home</a>
                    <a href="index.html#about" className="scrollto">About</a>
                </nav>
                </div>
            </div>
            </div>
            </footer>

            <a href="#" className="back-to-top"><i className="icofont-simple-up"></i></a>

        </div>
    );
}

export default withRouter(Doc);
