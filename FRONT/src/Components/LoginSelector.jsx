import { useNavigate } from "react-router-dom";

function LoginSelector() {
  const navigate = useNavigate();

  const loginCards = [
    {
      title: "User",
      subtitle: "Students, Faculty, and Staff",
      color: "from-green-600 to-emerald-600",
      route: "/login/user",
    },
    {
      title: "Employee",
      subtitle: "Post Office Staff",
      color: "from-blue-600 to-cyan-600",
      route: "/login/employee",
    },
    {
      title: "Admin",
      subtitle: "Head Officer and Manager",
      color: "from-red-600 to-pink-600",
      route: "/login/admin",
    },
  ];

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/iit-jammu-mockup-iit-jammu.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/60"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            IIT Jammu
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
            Post Office Automation System
          </h2>
          <p className="text-gray-600">Select your role to continue</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {loginCards.map((card, index) => (
            <button
              key={index}
              onClick={() => navigate(card.route)}
              className={`group relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 border border-gray-200 hover:shadow-xl`}
            >
              {/* Subtle gradient ring on hover */}
              <div className={`absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                <div className={`absolute -inset-[2px] rounded-2xl bg-gradient-to-br ${card.color} opacity-20`}></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-gray-900">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 mb-6">{card.subtitle}</p>
                <div className={`mt-auto px-6 py-2 bg-gradient-to-r ${card.color} text-white rounded-lg font-semibold transform group-hover:scale-105 transition-transform duration-300 shadow-md`}>
                  Continue
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">© 2024 IIT Jammu Post Office System</p>
        </div>
      </div>
    </div>
  );
}

export default LoginSelector;