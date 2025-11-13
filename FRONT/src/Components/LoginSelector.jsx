import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- SVG Icons (Styled for a light-on-dark look) ---

const ChevronLeftIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// --- Main Component ---

function LoginSelector() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Use the gradient colors from your previous design
const loginOptions = [
    {
      title: "User",
      subtitle: "Students, Faculty, and Staff",
      route: "/login/user",
      color: "from-gray-600 to-gray-800", // Light grey gradient
    },
    {
      title: "Employee",
      subtitle: "Post Office Staff",
      route: "/login/employee",
      color: "from-gray-700 to-gray-900", // Medium grey gradient
    },
    {
      title: "Admin",
      subtitle: "Head Officer and Manager",
      route: "/login/admin",
      color: "from-gray-800 to-black",     // Dark grey to black gradient
    },
  ];

  // --- Animation Variants for Framer Motion ---
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    const newIndex = (page + newDirection + loginOptions.length) % loginOptions.length;
    setPage([newIndex, newDirection]);
    setSelectedIndex(newIndex);
  };

  const handleContinue = () => {
    navigate(loginOptions[selectedIndex].route);
  };

  const currentOption = loginOptions[selectedIndex];

  return (
    // Main container with background image
    <div
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-cover bg-center"
      // Make sure this image is in your /public folder
      style={{ backgroundImage: "url('/iit-jammu-mockup-iit-jammu.jpg')" }}
    >
      {/* Semi-transparent overlay to make text readable */}
      <div className="absolute inset-0 bg-white/60"></div>

      {/* Main Content Wrapper (positioned above the overlay) */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            IIT Jammu
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
            Post Office Automation System
          </h2>
        </motion.div>

        {/* Main Card (Dark) */}
        <div className="relative w-full h-[320px] bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Animated Content */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
              <h3 className="text-3xl font-bold text-white mb-2">
                {currentOption.title}
              </h3>
              <p className="text-base text-gray-300 mb-10">
                {currentOption.subtitle}
              </p>
              <button
                onClick={handleContinue}
                className={`w-full px-6 py-3 bg-gradient-to-r ${currentOption.color} text-white rounded-lg font-semibold transform transition-all duration-300 shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`}
              >
                Continue
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls (Styled for dark card) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-between w-full max-w-xs mt-6"
        >
          {/* Previous Button */}
          <button
            onClick={() => paginate(-1)}
            className="p-3 rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/50 transition-colors"
          >
            <ChevronLeftIcon />
          </button>

          {/* Dots */}
          <div className="flex space-x-2">
            {loginOptions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const newDirection = index > selectedIndex ? 1 : -1;
                  setPage([index, newDirection]);
                  setSelectedIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  selectedIndex === index ? "bg-gray-800" : "bg-gray-400 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => paginate(1)}
            className="p-3 rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/50 transition-colors"
          >
            <ChevronRightIcon />
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-gray-600 text-sm mt-12"
        >
          © 2025 IIT Jammu Post Office System
        </motion.p>
      </div>
    </div>
  );
}

export default LoginSelector;
// import { useNavigate } from "react-router-dom";

// function LoginSelector() {
//   const navigate = useNavigate();

//   const loginCards = [
//     {
//       title: "User",
//       subtitle: "Students, Faculty, and Staff",
//       color: "from-green-600 to-emerald-600",
//       route: "/login/user",
//     },
//     {
//       title: "Employee",
//       subtitle: "Post Office Staff",
//       color: "from-blue-600 to-cyan-600",
//       route: "/login/employee",
//     },
//     {
//       title: "Admin",
//       subtitle: "Head Officer and Manager",
//       color: "from-red-600 to-pink-600",
//       route: "/login/admin",
//     },
//   ];

//   return (
//     <div
//       className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-cover bg-center"
//       style={{ backgroundImage: "url('/iit-jammu-mockup-iit-jammu.jpg')" }}
//     >
//       <div className="absolute inset-0 bg-white/60"></div>

//       {/* Main Content */}
//       <div className="relative z-10 w-full max-w-5xl px-6 py-12">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold text-gray-800 mb-2">
//             IIT Jammu
//           </h1>
//           <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
//             Post Office Automation System
//           </h2>
//           <p className="text-gray-600">Select your role to continue</p>
//         </div>

//         {/* Role Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
//           {loginCards.map((card, index) => (
//             <button
//               key={index}
//               onClick={() => navigate(card.route)}
//               className={`group relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 border border-gray-200 hover:shadow-xl`}
//             >
//               {/* Subtle gradient ring on hover */}
//               <div className={`absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
//                 <div className={`absolute -inset-[2px] rounded-2xl bg-gradient-to-br ${card.color} opacity-20`}></div>
//               </div>
              
//               {/* Content */}
//               <div className="relative z-10 flex flex-col items-center text-center">
//                 <h3 className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-gray-900">
//                   {card.title}
//                 </h3>
//                 <p className="text-sm text-gray-500 mb-6">{card.subtitle}</p>
//                 <div className={`mt-auto px-6 py-2 bg-gradient-to-r ${card.color} text-white rounded-lg font-semibold transform group-hover:scale-105 transition-transform duration-300 shadow-md`}>
//                   Continue
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-12">
//           <p className="text-gray-400 text-sm">© 2024 IIT Jammu Post Office System</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginSelector;