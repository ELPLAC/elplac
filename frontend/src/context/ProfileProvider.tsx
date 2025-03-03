"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  ISeller,
  ProfileImageContextType,
  ProfileImageProviderProps,
  UserDto,
} from "@/types";
import { useAuth } from "./AuthProvider";
import { decodeJWT } from "@/helpers/decoder";
import { getSeller, getUser } from "@/helpers/services";
import { useFair } from "./FairProvider";

const ProfileImageContext = createContext<ProfileImageContextType | undefined>(
  undefined
);

export const ProfileImageProvider: React.FC<ProfileImageProviderProps> = ({
  children,
}) => {
  const { token } = useAuth();
  const [userDtos, setUserDtos] = useState<UserDto | null>(null);
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [sellerDtos, setSellerDtos] = useState<ISeller | null>(null);
  const { activeFair } = useFair();
  const [sellerRegistration, setSellerFairRegistration] = useState<
    boolean | undefined
  >(false);


  useEffect(() => {
    if (sellerDtos && activeFair) {
      const fairRegistration = sellerDtos?.registrations?.some(
        (fairRegistration) => fairRegistration.fair.id === activeFair.id
      );
      setSellerFairRegistration(fairRegistration);
    }
  }, [sellerDtos, activeFair]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setUserDtos(null); 
        return;
      }
  
      try {
        const decoded = decodeJWT(token);
        if (decoded?.id) {
          const res = await getUser(token, decoded.id);
          if (res) {
            setUserDtos(res);
          } else {
            setUserDtos(null); 
          }
        }
      } catch (error) {
        setUserDtos(null); 
      }
    };
  
    fetchUserProfile();
  }, [token]);
  

  useEffect(() => {
    const fetchSellerProfile = async () => {
      if (token && userDtos?.seller?.id) {
        const res = await getSeller(token, userDtos.seller.id);
        setSellerDtos(res);
      }
    };

    fetchSellerProfile();
  }, [userDtos?.seller?.id, token]);

  const updateUserDtos = (updatedUser: UserDto) => {
    setUserDtos(updatedUser);
  };

  return (
    <ProfileImageContext.Provider
      value={{
        userDtos,
        setUserDtos,
        profileImageChanged,
        setProfileImageChanged,
        sellerDtos,
        setSellerDtos,
      }}
    >
      {children}
    </ProfileImageContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileImageContext);
  if (!context) {
    throw new Error(
      "useProfileImageContext debe ser usado dentro de un Provider"
    );
  }
  return context;
};
