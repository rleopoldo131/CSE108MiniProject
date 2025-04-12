import React from 'react';
import {Link} from 'react-router-dom';


function Home(){//main parent function that will store everything else -> export Home

    //
    //const
return (

    <div  className="page-container"> 
        <h1> Welcome to Home page</h1>
        <Link to="/register"> Register</Link>
        <Link to="/teacherpage"> Teacher Page</Link>

    </div>
   

);




}

export default Home;