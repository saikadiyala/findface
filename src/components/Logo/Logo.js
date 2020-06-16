import React from 'react';
import Tilt from 'react-tilt';
import bino from './binologo.png';
import './Logo.css';
const Logo=()=>{

    return(
       <div className='ma3 nt2'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 50 }} style={{ height: 100, width: 100 }} >
                 <div className="Tilt-inner pa3"> <img style={{paddingTop:'5px'}}src= {bino} alt="binologo"/></div>
</Tilt>
       </div>


    )


}
export default Logo;
