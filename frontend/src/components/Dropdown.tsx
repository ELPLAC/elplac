import { DropdownProps, DropdownOption } from "@/types";
import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onSelect,
  placeholder,
  noId,
  bg,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (option: DropdownOption) => {
    setSelectedValue(option.name);  
    onSelect(option);  
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className} w-[300px]`}>
      <button
        className={`flex items-center justify-between w-full p-2 rounded-md ${bg ? bg : "bg-secondary-lighter"} text-primary-dark shadow-md`}
        onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedValue || placeholder}</span>
        <div className="w-5 h-5 pt-1 text-primary-dark">
          <FaChevronDown />
        </div>
      </button>
      {isOpen && (
        <ul className={`absolute z-10 left-0 w-full rounded-b-md h-fit max-h-60 overflow-x-auto ${bg ? bg : "bg-secondary-lighter"} shadow-md`}>
          {options?.map((option) => (
            <li
              key={option.id}
              className="p-2 cursor-pointer text-[#9EAAAA] hover:text-primary-dark border-t border-primary-light"
              onClick={() => handleSelect(option)}>
              {noId ? option.name : `${option.name}`}  
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default Dropdown;
