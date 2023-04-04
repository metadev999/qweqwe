import React from "react";
import { Nav, NavLink, NavMenu } 
    from "./NavbarElements";
  
const Navbar = () => {
  return (
    <>
   
      <Nav>
        <NavMenu>
        <h6>Stake Updates</h6>
        <NavLink to="/home">
           STAKE TOSA
          </NavLink>
          <NavLink to="/tosatsuyu" >
            tosa X tsuyu
          </NavLink>
          <NavLink to="/tsuyutosa" >
         tsuyu x tosa 
          </NavLink>
         
       
        </NavMenu>
      </Nav>
    </>
  );
};
  
export default Navbar;