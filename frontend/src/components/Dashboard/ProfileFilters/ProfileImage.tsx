import { useProfile } from '@/context/ProfileProvider';
import Image from 'next/image';
import React from 'react'
import profile from "../../../assets/profile.png";
import { IProfileImage } from '@/types';


const ProfileImage: React.FC<IProfileImage> = ({
  className,
  handleImageUpload,
  fileInputRef,
  handleChangePhotoClick}
) => {
  const { userDtos, setUserDtos } = useProfile();

  return (
    <div className={className}>
      <Image
        src={userDtos?.profile_picture || profile}
        alt="user"
        width={150}
        height={150}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="absolute top-0 left-0 w-full h-full opacity-0"
      />
      <button
        className="absolute bottom-0 right-0 text-sm opacity-0 hover:opacity-100 bg-primary-darker bg-opacity-50 w-full justify-center p-1"
        onClick={handleChangePhotoClick}
      >
        Cambiar <br />
        foto 🖌
      </button>
    </div>
  );
};

export default ProfileImage

