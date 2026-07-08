import React, { useContext, useState } from "react";
import Card from "../components/Card";
import image1 from '../assets/image1.png'
import image3 from "../assets/image3.png";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoSparkles } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { userDataContext } from "../Context/userContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
      

export default function Customize() {
  const {
    BASEURL,  
    userDetails, setUserdetails,
    preview, setPreview,
    uploadedImg, setUploadedImg,
    assistantName,  setAssistantName,
    selectedImg, setSelectedImg,
  } = useContext(userDataContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

function handleImage(e) {
    const image = e.target.files[0];
    if (!image) return;
    setUploadedImg(image);

    const imageURL = URL.createObjectURL(image);
    setPreview(imageURL);

    setSelectedImg(imageURL);
  }

  function removeUploadedImage(e) {
    e.stopPropagation();
    setPreview(null);
    setUploadedImg(null);
    if (selectedImg === preview) {
      setSelectedImg(null);
    }
  }

async function handleNext() {
    const formdata = new FormData();
    formdata.append("assistantName", assistantName);

    if (uploadedImg) {
      formdata.append("image", uploadedImg);
    } else {
      formdata.append("assistantImg", selectedImg);
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASEURL}/update-assistant`, formdata, { withCredentials: true });
      const updated = response.data.data;
    
      setUserdetails(updated);
      navigate('/');
    
    } catch (error) {
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  const hasAssistantSetup = userDetails?.assistantName && userDetails?.assistantImg;

return (
  <div className='w-full min-h-screen flex flex-col items-center justify-start py-12 px-4 md:px-10 bg-[#0b0b1e] bg-linear-to-t from-black/40 to-[#9a9ad2]'>

<div className="w-full max-w-4xl mb-8">

  {/* Back Button */}
  {hasAssistantSetup && (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={() => navigate("/")}
        className="text-white text-3xl hover:scale-110 transition-transform p-1.5 bg-white/10 rounded-full cursor-pointer"
      >
        <IoMdArrowRoundBack />
      </button>

      <p className="text-lg font-bold text-white bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
        Head back to Home if you have already set your assistant.
      </p>
    </div>
  )}

  {/*  Heading */}
  <div className="flex justify-center">
    <h1 className="text-white text-xl md:text-2xl font-bold flex items-center gap-2 text-center">
      Select your{" "}
      <span className="inline-flex items-center gap-1 text-green-400">
        <IoSparkles />
        Assistant Image
      </span>
    </h1>
  </div>

</div>


    {/* Images and input box  */}
{/* Images and input box container */}
<div className='w-full max-w-3xl flex flex-wrap justify-center items-center gap-6 mt-7 mb-8'>
  
  {/* Reusing Card Directly without Redundant Wrappers */}
  <Card image={image1} />
  <Card image={image3} />

  {/* Custom Upload Block */}
  {preview ? (
    <div
      onClick={() => setSelectedImg(preview)}
      className={`w-50 h-60 lg:w-55 lg:h-65 relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-150 hover:scale-105 ${
        selectedImg === preview ? "ring-4 ring-green-400 shadow-lg shadow-green-500/50 hover:scale-120 hover:-translate-y-5 " : "border border-white/20"
      }`}
    >
      <img
        src={preview}
        alt="Preview"
        className="w-full h-full object-cover"
      />
      <IoMdCloseCircleOutline
        onClick={removeUploadedImage}
        className="absolute top-2 right-2 text-2xl text-red-400 bg-black/60 rounded-full hover:scale-110 transition-transform"
      />
    </div>
  ) : (
    <label
      htmlFor="assistant-image"
      className="w-50 h-60 lg:w-55 lg:h-65 bg-[#030326]/60 border-2 border-dashed border-white/20 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:bg-[#030326]/90 transition-all"
    >
      <BiSolidImageAdd className="text-4xl text-white/70 mb-2" />
      <span className="text-xs text-white/50 px-2 text-center">
        Upload Image
      </span>
    </label>
  )}

  <input
    type="file"
    id="assistant-image"
    accept="image/*"
    hidden
    onChange={handleImage}
  />
</div>

    {/* Forms Controls Form Wrapper Inputs */}
    <div className="w-full max-w-md flex flex-col gap-4 items-center">
      <input
        type="text"
        minLength={3}
        maxLength={7}
        placeholder="Give your assistant a name, e.g., Jarvis"
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
        className="w-full h-14 px-5 border-2 border-white/20 bg-white/10 text-white rounded-xl outline-none text-center text-lg font-bold placeholder:text-white/40 focus:border-blue-400 transition-all"
      />

      <button
        disabled={!assistantName.trim() || !selectedImg || loading}
        onClick={handleNext}
        className="w-full py-3.5 rounded-xl bg-linear-to-r from-blue-400 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 disabled:bg-gray-600 disabled:opacity-40 text-white text-lg font-semibold shadow-lg transition-all cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? "AI is getting ready ..." : "Next"}
      </button>
    </div>

  </div>
);
}
