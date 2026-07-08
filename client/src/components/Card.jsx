import React, { useContext } from "react";
import { userDataContext } from "../Context/userContext";

export default function Card({ image, isUploaded = false }) {
  const { selectedImg, setSelectedImg, setUploadedImg, setPreview } = useContext(userDataContext);

  function handleSelect() {
    setSelectedImg(image);
    // Only wipe preset track values if the user explicitly switches back to a preset card
    if (!isUploaded) {
      setUploadedImg(null);
      setPreview(null);
    }
  }

  const isSelected = selectedImg === image;

  return (
    <div
      onClick={handleSelect}
      className={`w-50 h-60 lg:w-55 lg:h-65 bg-[#030326] overflow-hidden rounded-2xl cursor-pointer
      transition-all duration-300 ease-out 
      hover:scale-120 hover:-translate-y-5 hover:shadow-2xl hover:shadow-white/44
      ${
        isSelected
          ? "border-4 border-green-500 shadow-xl shadow-green-500/40"
          : "border-4 border-white/10 hover:border-white "
      }`}
    >
      <img 
        src={image} 
        alt="assistant choice" 
        className="w-full h-full object-cover pointer-events-none" 
      />
    </div>
  );
}








