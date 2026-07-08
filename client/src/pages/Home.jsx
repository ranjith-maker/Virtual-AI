import React, { useContext, useEffect, useState } from 'react'
import { userDataContext } from '../Context/userContext'
import Card from '../components/Card'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { BiLogOutCircle } from "react-icons/bi";
import axios from 'axios';
import { useRef } from 'react';
import { RiMenu3Line } from "react-icons/ri";
import { IoMdCloseCircleOutline } from "react-icons/io";




export default function Home() {

  const { userDetails, setUserdetails, BASEURL } = useContext(userDataContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Click 'Start talking' to speak.");
  
  // Showing our chats in UI
  const [userTranscript, setUserTranscript] = useState("");
  const [assistantReply, setAssistantReply] = useState("");

  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  // starting to listen user voice
function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    synth.cancel(); // Stopping reading aloud if user interrupts
    setUserTranscript(""); // Reset panel logs on new input step
    setAssistantReply("");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onresult = async (ev) => {
      const transcript = ev.results[ev.results.length - 1][0].transcript.trim();
      // console.log("I said:", transcript);
      
      setUserTranscript(transcript); 
      setStatusMessage("Analyzing your command...");
      setLoading(true);

      try {
        const result = await axios.post(`${BASEURL}/asktoai`, { command: transcript }, { withCredentials: true });
        handleCommand(result.data);
      } catch (error) {
        console.error("API Gateway error:", error);
        setStatusMessage("Error getting response from AI.");
        setLoading(false);
      }
    };

    recognition.onstart = () => {
      setListening(true);
      setStatusMessage("Listening... Speak now, then click 'Stop & Send'.");
    };

    recognition.onerror = (ev) => {
      console.error("Recognition Error:", ev.error);
      if (ev.error === "not-allowed") {
        setStatusMessage("Permission denied! Enable your microphone.");
      } else {
        setStatusMessage(`Error: ${ev.error}. Try clicking Start again.`);
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  }

  //  stop listening
function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setStatusMessage("Processing audio...");
    }
  }

  //  AI answers and routes to next page
function handleCommand(data) {
    setLoading(false);
    if (!data) {
      setStatusMessage("No data returned from assistant.");
      return;
    }

    const { type, userInput, response } = data;
    
    setAssistantReply(response); 
    setStatusMessage(`Executed action: ${type}`);

    const utterance = new SpeechSynthesisUtterance(response);
    synth.speak(utterance);

    const query = encodeURIComponent(userInput || "");
    switch (type) {
      case "google_search":
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
        break;
      case "calculator_open":
        window.open(`https://www.google.com/search?q=calculator`, "_blank");
        break;
      case "instagram_open":
        window.open(`https://www.instagram.com/`, "_blank");
        break;
      case "facebook_open":
        window.open(`https://www.facebook.com/`, "_blank");
        break;
      case "weather_show":
        window.open(`https://www.google.com/search?q=${query}+weather`, "_blank");
        break;
      case "youtube_search":
      case "youtube_play":
        window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
        break;
      case "linkedin_open":
        window.open(`https://www.linkedin.com/`, "_blank");
        break;
      default:
        break;
    }
  }

  // logout here
async function handleLogout() {
    try {
      if (recognitionRef.current) recognitionRef.current.stop();
      synth.cancel();
      await axios.post(`${BASEURL}/logout-user`, {}, { withCredentials: true });
      setUserdetails(null);
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col relative py-24 gap-5 items-center bg-linear-to-t from-black/10 to-[#9a9ad2]">
      
      <IoMdArrowRoundBack
        onClick={() => navigate("/customize")}
        className="absolute top-14 left-10 text-5xl hover:scale-110 transition-transform cursor-pointer px-2 bg-white/10 rounded-full text-white z-10"
      />

      {/* lap logout*/}
      <button
        type="button"
        onClick={handleLogout}
        className="hidden md:block w-36 rounded-xl absolute top-12 right-10 bg-linear-to-r from-blue-500 to-indigo-700 hover:from-blue-600 hover:to-indigo-800 text-md px-4 py-2 font-semibold text-white shadow-lg transition-all cursor-pointer"
      >
        Logout
      </button>

      {/* for mobile logout hide  */}
      <RiMenu3Line
        onClick={() => setIsMenuOpen(true)}
        className="block md:hidden absolute top-14 right-10 text-3xl text-white cursor-pointer hover:opacity-80 transition-opacity z-10"
      />

      {/* side bar for mobile logout */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-64 bg-[#1e1e2f] h-full p-6 flex flex-col gap-6 shadow-2xl border-l border-white/10 relative">
            
            <IoMdCloseCircleOutline
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-3xl text-white/70 hover:text-white cursor-pointer hover:scale-110 transition-transform"
            />

            <h3 className="text-white font-bold text-lg border-b border-white/10 pb-3 mt-8">
              Menu Options
            </h3>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-center bg-linear-to-r from-red-500 to-rose-700 hover:from-red-600 hover:to-rose-800 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Logout Account
            </button>
          </div>
        </div>
      )}

      <div
      className='w-50 h-60 lg:w-55 lg:h-65 bg-[#030326] overflow-hidden rounded-2xl cursor-pointer
      transition-all duration-300 ease-out hover:border-4  hover:border-white
      hover:scale-120 hover:-translate-y-5 hover:shadow-2xl hover:shadow-white/30'
    >
      <img 
        src={userDetails?.assistantImg} 
        alt="assistant choice" 
        className="w-full h-full object-cover pointer-events-none" 
      />
    </div>

      <h1 className="text-white text-2xl font-bold mt-4 text-center px-4">
        Hello {userDetails?.name || "User"}, I'm your assistant, {userDetails?.assistantName || "Jarvis"}
      </h1>

      {/* Instruction here start and stop also  */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl w-11/12 max-w-md flex flex-col items-center gap-4 text-center mt-4 shadow-xl">
        
        <p className="text-yellow-200 text-xs font-semibold tracking-wide uppercase">
          💡 Instruction: Turn on your mic before hitting start. Press Stop when done speaking.
        </p>

        <p className="text-white/90 text-sm italic min-h-7.5 flex items-center justify-center">
          {loading ? `${userDetails?.assistantName || "Jarvis"} is thinking...` : statusMessage}
        </p>

        <div className="flex gap-4 w-full justify-center mt-2">
          <button
            type="button"
            disabled={listening || loading}
            onClick={startListening}
            className="flex-1 bg-green-600 hover:bg-green-800 disabled:bg-gray-500 disabled:opacity-40 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Start Talking
          </button>

          <button
            type="button"
            disabled={!listening || loading}
            onClick={stopListening}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 disabled:opacity-40 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Stop & Send
          </button>
        </div>
      </div>

      {/* Chat like UI */}
      {(userTranscript || assistantReply) && (
        <div className="w-11/12 max-w-md flex flex-col gap-3 mt-4">
          {userTranscript && (
            <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] self-end text-sm shadow-md animate-fade-in">
              <p className="text-[10px] text-blue-200 font-bold uppercase mb-1">You said</p>
              <p>{userTranscript}</p>
            </div>
          )}

          {assistantReply && (
            <div className="bg-white/20 text-white border border-white/10 p-3 rounded-2xl rounded-tl-none max-w-[85%] self-start text-sm shadow-md backdrop-blur-sm animate-fade-in">
              <p className="text-[10px] text-indigo-200 font-bold uppercase mb-1">{userDetails?.assistantName || "Assistant"}</p>
              <p>{assistantReply}</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}


