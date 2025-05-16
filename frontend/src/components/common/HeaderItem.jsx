const HeaderItem = ({ icon: Icon, label, active, onClick }) => {
  return (
    <li className="relative">
      <button
        onClick={onClick}
        className={`flex flex-col items-center cursor-pointer px-4 py-3 transition-all duration-200 ${
          active ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
        }`}
      >
        <Icon className="text-xl" />
        <span className="text-xs mt-1 whitespace-nowrap">{label}</span>
        <span
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-600 transition-all duration-300 ${
            active ? "w-3/4" : "w-0"
          }`}
        ></span>
      </button>
    </li>
  );
};

export default HeaderItem;
