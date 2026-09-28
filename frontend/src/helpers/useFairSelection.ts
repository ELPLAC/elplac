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
      // ✅ Garantizamos que fairs sea un arreglo antes de invocar .find()
      const safeFairs = Array.isArray(fairs) ? fairs : [];
      const fairSelectedPerUser = safeFairs.find(
        (f) => f && f.name === selectedOption
      );

      if (fairSelectedPerUser) {
        // ✅ Aseguramos que fairCategories sea un arreglo válido
        const safeCategories = Array.isArray(fairSelectedPerUser?.fairCategories)
          ? fairSelectedPerUser.fairCategories
          : [];

        setCategoriesArray(safeCategories);
        setFairDescription(fairSelectedPerUser?.entryDescription || null);
      } else {
        setCategoriesArray([]);
        setFairDescription(null);
      }
    } else {
      setCategoriesArray(null);
      setFairDescription(null);
    }
  }, [selectedOption, fairs]);

  const handleSelect = (option: DropdownOption) => {
    if (option?.name) {
      setSelectedOption(option.name);
    }
  };

  const handleSelectCategory = (option: { id: string; name: string }) => {
    if (option?.name) {
      setSelectedOptionCategory(option.name);
      console.log(option.name);
    }
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