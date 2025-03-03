"use client";
import { useState, useRef } from "react";

import { SearchbarProps } from "@/types";
import SearchIcon from "./SearchIcon.tsx";
const Searchbar: React.FC<SearchbarProps> = ({ users, setUsersFiltered }) => {
  const [search, setSearch] = useState<string>("");

  const searchRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setUsersFiltered(filteredUsers);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center  border border-[#D0D5DD] rounded-lg py-2 px-4 w-40 md:w-60 bg-white ">
        <div>
          <SearchIcon className=" bg-red-100 text-red-500" />
        </div>
        <input
          onChange={handleChange}
          value={search}
          className="focus:outline-none text-primary-darker flex-grow ml-2 bg-transparent"
          placeholder="Buscar"
        />
      </div>
    </div>
  );
};

export default Searchbar;
