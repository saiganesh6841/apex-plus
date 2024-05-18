import React from 'react';
import "./navbar.css"
import { Link } from 'react-router-dom';


const Navbar = () => {


    return (
        <>
            <nav className="navbar">
                <ul>
                    <Link to="/"><li><a>Home</a></li></Link>
                    <Link to="/scenario"><li><a>Add Scenario</a></li></Link>
                    <Link to="/allScenario"><li><a>All Scenarios</a></li></Link>
                    <Link to="/vehicle"><li><a >Add Vehicle</a></li></Link>
                </ul>
            </nav>
        </>
    )
}
export default Navbar