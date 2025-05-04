import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

function Homepage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
     
      navigate(`/assets`);
    }
  };

  return (
    <div className="m-50">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="space-y-5 text-center">
          <h1 className="font-bold">
            Discover and Book Government Training Infrastructure
          </h1>
          <h2 className="font-semibold text-xl">
            Find classrooms, labs, faculty, and more - across institutions
          </h2>
        </div>
        <form onSubmit={handleSearch} className="w-1/2 mx-auto mt-10">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
              <SearchIcon />
            </span>
            <input
              id="search"
              placeholder="Search for training infrastructure"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-13 rounded-full border-2 border-blue-500 w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Homepage;