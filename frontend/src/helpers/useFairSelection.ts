// useFairSelection.ts
import { useState, useEffect } from "react";
import { useFair } from "@/context/FairProvider";
import { DropdownOption, FairCategories } from "@/types";

const useFairSelection = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [categoriesArray, setCategoriesArray] = useState<FairCategories[] | null>(
    null
  );
  const [selectedOptionCategory, setSelectedOptionCategory] = useState<
    string | null
  >(null);
  const [openModal, setOpenModal] = useState(false);
  const [fairDescription, setFairDescription] = useState<string | null>(null);
  const { fairs } = useFair();

  useEffect(() => {
    if (selectedOption) {
      const fairSelectedPerUser = fairs.find((f) => f.name === selectedOption);
      if (fairSelectedPerUser) {
        setCategoriesArray(fairSelectedPerUser?.fairCategories);
        setFairDescription(fairSelectedPerUser?.entryDescription);
      }
    } else {
      setCategoriesArray(null);
      setFairDescription(null);
    }
  }, [selectedOption, fairs]);

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option.name);
  };

  const handleSelectCategory = (option: { id: string; name: string }) => {
    setSelectedOptionCategory(option.name);
  };

  return {
    selectedOption,
    categoriesArray,
    selectedOptionCategory,
    openModal,
    setSelectedOption,
    setSelectedOptionCategory,
    setOpenModal,
    handleSelect,
    handleSelectCategory,
    fairDescription,
  };
};

export default useFairSelection;
