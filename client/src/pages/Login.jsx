import React, { useContext, useState } from 'react'
import { IoSparkles } from "react-icons/io5";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { AiFillEye } from "react-icons/ai";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { userDataContext } from '../Context/UserContext'



export default function Login() {

const initialState = {
email : 'roh@gmail.com',
password : 'Google@10.',
}

const [formdata, setFormdata ] = useState(initialState)
const [showPass , setShowPass] = useState(false)
const [showErr, setShowErr ] = useState('') 
const [loading , setLoading] = useState(false)

const navigate = useNavigate()

const {BASEURL , userDetails , setUserdetails  } = useContext(userDataContext)


function handleChange(ev){

  const {name, value} = ev.target

  setFormdata((prev)=>{
    return {
      ...prev , [name] : value
    }
  })
}



async function handleForm(ev) {
  
ev.preventDefault()

try {
  setShowErr('')
  setLoading(true)
  const url = BASEURL

  const response = await axios.post(url +'/login-user', 
    formdata, {withCredentials : true} )
    setLoading(false)
    const upload = response.data.data
    setUserdetails(upload)
    return navigate('/customize')

} catch (error) {
  console.log(error?.response?.data?.message);
  setLoading(false)
  setUserdetails(null)
  setShowErr(error?.response?.data?.message)

}}


return (
<>
<div className="w-full min-h-screen bg-[#0b0b1e] bg-radial-[at_top_right] from-black/60 to-[#8686e9] flex items-center justify-center px-6 py-20 relative overflow-hidden">

  {/* Background Glows */}
  <div className="absolute top-1/4 left-1/2 w-72 h-72 bg-[#7f7fe9] rounded-full blur-3xl pointer-events-none" />

  {/* Card */}
  <div className="relative z-10 w-full max-w-lg rounded-3xl bg-gray-700/90 backdrop-blur-xl border border-gray-800 p-12 shadow-2xl">

    <div className="flex items-center gap-3 mb-6">
      <div className="flex h-12 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-blue-600 text-white text-xl shadow-lg">
        <IoSparkles />
      </div>

      <h1 className="text-2xl font-bold text-white leading-tight">
        Login to meet the Assistant that{" "}
        <span className="bg-linear-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
          Listens you.
        </span>
      </h1>
    </div>

  <div className="flex justify-center items-center p-8 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl shadow-2xl shadow-black/30 w-full max-w-lg">
  <form onSubmit={handleForm} className="flex flex-col justify-center items-center gap-6 w-full">

    <label htmlFor="email" className="w-full text-white font-medium">
      EMAIL
      <input
        type="email" placeholder="email"
        name="email"  id="email"   
        value={formdata.email} required
        onChange={handleChange}
        className="w-full mt-2 rounded-xl text-lg  bg-white/10 border border-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:border-blue-500 focus:bg-white/15 transition"
      />
    </label>

    <label htmlFor="password" className="w-full text-white font-medium block">
     PASSWORD
  <div className="relative w-full flex items-center mt-2">
    <input
      type={showPass ? 'text' : 'password'}
      placeholder="password"
      name="password"
      id="password"
      value={formdata.password}
      required
      onChange={handleChange}
      className="w-full rounded-xl text-lg bg-white/10 border border-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:border-blue-500 focus:bg-white/15 transition pr-12"
    />
    <div className="absolute right-4 text-2xl z-20 cursor-pointer text-white/70 hover:text-white select-none">
      {!showPass ? (
        <AiFillEye onClick={() => setShowPass(true)} />
      ) : (
        <BsFillEyeSlashFill onClick={() => setShowPass(false)} />
      )}
    </div>
  </div>
</label>

    <div className='h-4' >
 {showErr && <p className='text-red-400 font-bold text-lg'  > {showErr} </p> }

    </div>

    <button
      type="submit" disabled={loading}
      className="mt-2 w-full  rounded-xl bg-linear-to-r from-blue-400 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 text-xl  px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] hover:shadow-blue-500/40 transition-all cursor-pointer"
    >
     {loading ? 'Loging...' : 'Login'}
    </button>
    <p className='text-xl ' > New to my AI <span  onClick={()=>navigate('/signup') }  className='text-white underline font-semibold cursor-pointer hover:text-indigo-400 ' > signup here </span> </p>

  </form>
</div>
  </div>

</div>






</>
  )
}




// email : 'roh@gmail.com',
// password : 'Google@10.',