import { useNavigate } from "react-router-dom";

function LoginSelector() {
  const navigate = useNavigate();

  const loginCards = [
    {
      title: "User",
      subtitle: "Student, Faculty, Staff",
      icon: "👤",
      color: "from-green-500 to-emerald-600",
      hoverColor: "hover:from-green-600 hover:to-emerald-700",
      route: "/login/user",
    },
    {
      title: "Employee",
      subtitle: "Post Office Staff",
      icon: "👔",
      color: "from-blue-500 to-cyan-600",
      hoverColor: "hover:from-blue-600 hover:to-cyan-700",
      route: "/login/employee",
    },
    {
      title: "Admin",
      subtitle: "Manager, Head Officer",
      icon: "🛡️",
      color: "from-red-500 to-pink-600",
      hoverColor: "hover:from-red-600 hover:to-pink-700",
      route: "/login/admin",
    },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-200 rounded-full -top-40 -left-40 filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-200 rounded-full -bottom-40 -right-40 filter blur-3xl opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute w-[300px] h-[300px] bg-blue-200 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 filter blur-3xl opacity-30"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="text-6xl mb-2">📮</div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            IIT Jammu
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Post Office Automation System
          </h2>
          <p className="text-gray-500 text-lg">Select your role to continue</p>
        </div>

        {/* Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loginCards.map((card, index) => (
            <button
              key={index}
              onClick={() => navigate(card.route)}
              className={`group relative bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-gray-200`}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{card.subtitle}</p>
                <div className={`mt-4 px-6 py-2 bg-gradient-to-r ${card.color} text-white rounded-lg font-semibold transform group-hover:scale-105 transition-transform duration-300 shadow-md group-hover:shadow-lg`}>
                  Login →
                </div>
              </div>

              {/* Decorative Elements */}
              <div className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity duration-300`}></div>
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