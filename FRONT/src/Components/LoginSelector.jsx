import { useNavigate } from "react-router-dom";
// (Optional) Don't forget to install heroicons for this to work
// import { UserIcon, BriefcaseIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

function LoginSelector() {
  const navigate = useNavigate();

  // Reusable card classes (mostly the same, still clean)
  const cardClasses = [
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "p-8",
    "w-64",
    "h-48",
    "bg-white", // Solid white for the cards to contrast the glass
    "rounded-xl",
    "shadow-md",
    "border",
    "border-gray-200",
    "cursor-pointer",
    "transition-all",
    "duration-300",
    "ease-in-out",
    "text-gray-700",
    "hover:shadow-xl",
    "hover:scale-105",
    "hover:border-indigo-500",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-indigo-500",
    "focus:ring-opacity-50",
  ].join(" ");

  const iconClasses = "h-12 w-12 mb-4 text-indigo-600";

  return (
    // 1. This container is now relative and overflow-hidden
    //    to hold the new background elements.
    <div className="relative flex flex-col items-center justify-center h-screen bg-gray-50 overflow-hidden">
      
      {/* 2. These are the background "blobs" */}
      {/* They are absolute, positioned outside the view, blurred, and low opacity */}
      <div className="absolute w-[40rem] h-[40rem] bg-indigo-100 rounded-full -top-40 -left-60 filter blur-3xl opacity-50"></div>
      <div className="absolute w-[30rem] h-[30rem] bg-blue-100 rounded-full -bottom-20 -right-20 filter blur-3xl opacity-60"></div>

      {/* 3. This is the main "glass" card.
           - 'relative z-10' puts it on top of the blobs.
           - 'bg-white/70' makes it 70% opaque white.
           - 'backdrop-blur-lg' creates the "frosted glass" effect.
      */}
      <div className="relative z-10 p-10 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            IIT Jammu
          </h1>
          <h2 className="text-2xl font-light text-gray-600">
            Post Office Automation System
          </h2>
          <p className="text-gray-500 mt-4">Please select your role to continue</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-8">
          
          {/* Card 1: User Login */}
          <button
            onClick={() => navigate("/login/user")}
            className={cardClasses}
          >
            {/* <UserIcon className={iconClasses} /> */}
            <span className="text-2xl font-semibold">User</span>
            <span className="text-sm text-gray-500">Login</span>
          </button>

          {/* Card 2: Employee Login */}
          <button
            onClick={() => navigate("/login/employee")}
            className={cardClasses}
          >
            {/* <BriefcaseIcon className={iconClasses} /> */}
            <span className="text-2xl font-semibold">Employee</span>
            <span className="text-sm text-gray-500">Login</span>
          </button>

          {/* Card 3: Admin Login */}
          <button
            onClick={() => navigate("/login/admin")}
            className={cardClasses}
          >
            {/* <ShieldCheckIcon className={iconClasses} /> */}
            <span className="text-2xl font-semibold">Admin</span>
            <span className="text-sm text-gray-500">Login</span>
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default LoginSelector;