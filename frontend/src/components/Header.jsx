import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="w-full h-20 pl-6 flex left-0 items-center justify-between shadow-md fixed top-0">
      <div className="flex items-center">
        <img
          src="/logo.jpg"
          alt="logo"
          height="60"
          width="60"
          className="mr-4"
        />
        <p className="text-xl text-blue-500 font-bold">Karmayogi</p>
      </div>
      <div className="mr-4">
        <Button 
          variant="contained"
          onClick={() => navigate('/admin')}
        >
          Admin Login
        </Button>
      </div>
    </header>
  );
};

export default Header;