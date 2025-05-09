const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full p-3 rounded-lg transition-colors ${
          active ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"
        }`}
      >
        <Icon className="mr-3" />
        <span>{label}</span>
      </button>
    </li>
  );
  
  export default NavItem;