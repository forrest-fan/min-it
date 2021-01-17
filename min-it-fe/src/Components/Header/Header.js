import React from 'react';
import history from '../../history';

import minithead from './minithead.png';

function Header() {

    return (
        <header id="header" className="fixed-top d-flex align-items-center">
            <div className="container d-flex align-items-center">

                <div className="logo mr-auto">
                    <img src={ minithead } alt="" className="img-fluid" onClick={()=>{history.push('/')}}/>
                </div>

                <nav className="nav-menu d-none d-lg-block">
                    <ul>
                        <li className="active"><a href="#index.html">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li className="get-started"><a href="#about">Get Started</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
