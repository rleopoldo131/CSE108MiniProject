import React from 'react';
import {Link} from 'react-router-dom';
import './Home.css'; 


function Home(){//main parent function that will store everything else -> export Home

return (
    <div className= "page-container"> {/*from app.css*/}
  
        <div className="page-container2">
             <h1 > Welcome to Home page</h1>
             
              <div className="homepage-buttons">
                    <Link to="/register" className="btn">Register </Link>
                   
                    <Link to="/login" className="btn">Login</Link>
                    <Link to="/Admin" className="btn">Admin Panel</Link>

                    {/* <Link for development and see how they will look before adding protected routes*/}
                    {/* <Link to="/teacherpage" className="btn">Teacher page</Link>
                    <Link to="/studentpage" className="btn">Student page</Link> */}
              </div>

      
        </div>
       

   </div> 

);




}

export default Home;