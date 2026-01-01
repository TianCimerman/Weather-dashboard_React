import React, { useState } from 'react';  // Import useState
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faFan } from '@fortawesome/free-solid-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [isIframeVisible, setIframeVisible] = useState(false);  // Declare state for iframe visibility
  const [isIframeVisible2, setIframeVisible2] = useState(false);  // Declare state for iframe visibility
  const [loadingIframe, setLoadingIframe] = useState(false);

const handleIframeToggle = () => {
  setIframeVisible(!isIframeVisible);
  setIframeVisible2(false);
  setLoadingIframe(true);
};

const handleIframeToggle2 = async () => {
  setIframeVisible(false);
  setIframeVisible2(false); // Hide iframe first
  setLoadingIframe(true);   // Show loader immediately

  await handleAutoLogin();  // Wait for auto-login to complete

  // Now show the iframe
  setIframeVisible2(true);
};




  const handleAutoLogin = async () => {
    const res = await fetch('http://192.168.1.130:5000/auto-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'helios' })
    });
  
    const data = await res.json();
    console.log(data);
  };


  

  return (
    <>
      <nav className="navbar absolute top-0 right-0 w-[6.5rem] h-full flex justify-between items-center p-4 bg-gray-800 text-white sl:w-[4rem] sl:h-[85%]  " style={{ backgroundColor: 'hsl(218, 46%, 8%)' }}>
        <ul className="navbar-links flex justify-between items-center h-full flex-col pt-[2.8rem] pb-[2.8rem]">
          <li>
            <button onClick={() => window.location.reload()} className="hover:text-gray-500 transition duration-300 ease-in-out">
              <FontAwesomeIcon icon={faHouse} className="text-[3.5rem] sl:text-[2rem] " />
            </button>
          </li>
          <li>
            <button onClick={handleIframeToggle2} className="hover:text-gray-500 transition duration-300 ease-in-out">
              <FontAwesomeIcon icon={faFan} className="text-[3.5rem] sl:text-[2rem]" />
            </button>
          </li>
          <li>
            {/* Toggle iframe visibility when Grafana icon is clicked */}
            <button onClick={handleIframeToggle} className="hover:text-gray-500 transition duration-300 ease-in-out">
              <FontAwesomeIcon icon={faChartLine} className="text-[3.5rem] sl:text-[2rem]" />
            </button>
          </li>
          <li>
            <Link href="/feder">
              <FontAwesomeIcon icon={faPaw} className="text-[3.5rem] sl:text-[2rem]" />
            </Link>
          </li>
        </ul>
      </nav>

{isIframeVisible && (
  <div className="absolute top-0 left-0 w-[94.1%] h-screen z-50">
    <iframe
      src="http://192.168.1.160:3000"
      className="w-[101%] hss:w-[98%] h-full sl:w-[91.5%]"
      height="100%"
      title="Grafana Dashboard"
      style={{ pointerEvents: 'auto', border: 'none' }}
      onLoad={() => setLoadingIframe(false)} // Hide loader when iframe loads
    />
  </div>
)}


{isIframeVisible2 && (
  <div className='absolute top-0 left-0 w-[94.6%]  hss:w-[92%] h-full z-50'>
    <iframe
      src="http://192.168.1.180/info.htm"
      className="w-[100%] hss:w-[100%] h-full sl:w-[91.5%]"
      height="100%"
      title="Ventilation Dashboard"
      onLoad={() => setLoadingIframe(false)} // Hide loader when iframe loads
    ></iframe>
  </div>
)}

{loadingIframe && (
  <div className="inset-0 z-[999] flex items-center justify-center  bg-opacity-70 absolute top-0 left-0 w-[94.6%] hss:w-[92%] sl:w-[85.5%] h-full z-50" style={{ backgroundColor: 'rgb(48, 57, 70)' }}>
    <div className="text-white text-lg animate-pulse">Loading page...</div>
  </div>
)}

    </>
  );
};

export default Navbar;
