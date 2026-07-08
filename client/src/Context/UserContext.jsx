import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

//first you create it
export const userDataContext = createContext()

//this'll take all app as child and provide its value they need
export default function UserContext({children}) {

   const BASEURL = 'https://virtual-ai-backend-9lbp.onrender.com/api'
   const [userDetails, setUserdetails] = useState(null);
  const [appLoading, setAppLoading] = useState(true); // Gated initialization flag

  // states for the Customize view
  const [preview, setPreview] = useState(null);
  const [uploadedImg, setUploadedImg] = useState(null);
  const [assistantName, setAssistantName] = useState('');
  const [selectedImg, setSelectedImg] = useState(null);

useEffect(() => {
    const controller = new AbortController();

async function PersistUser() {
  try {
    const response = await axios.get(`${BASEURL}/view-profile`, {
      withCredentials: true,
      signal: controller.signal,
    });
    const upload = response.data.data;
    
    // Populating all profile information first
    if (upload?.assistantName) setAssistantName(upload.assistantName);
    if (upload?.assistantImg) setSelectedImg(upload.assistantImg);
    
    // now setting the user details
    setUserdetails(upload);
    
    // Turning off loading ONLY after user data is set in satate
    setAppLoading(false); 

  } catch (error) {
    if (!axios.isCancel(error)) {
      console.log(error?.response?.data?.message);
      setUserdetails(null);
      setAppLoading(false); // Turn off loading here too if the token is expired/invalid
    }
  }
}

    PersistUser();

    return () => {
      controller.abort(); // Safe layout request unmount hook
    };
  }, []);


  
  const value = {
    BASEURL, appLoading,
    userDetails, setUserdetails,
    preview,  setPreview,
    uploadedImg, setUploadedImg,
    assistantName, setAssistantName,
    selectedImg,  setSelectedImg,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}



