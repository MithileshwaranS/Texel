const NavItem = ({
  icon: Icon,
  label,
  active,
  onClick,
  collapsed,
  hovered,
}) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full p-3 rounded-lg cursor-pointer transition-colors ${
          active
            ? "bg-blue-100 text-blue-700"
            : "hover:bg-gray-100 text-gray-700"
        }`}
        title={collapsed ? label : ""} // Tooltip for collapsed state
      >
        <Icon className="flex-shrink-0" /> {/* Icon always visible */}
        {(!collapsed || hovered) && ( // Label shows when expanded or hovered
          <span className="ml-3 whitespace-nowrap overflow-hidden overflow-ellipsis">
            {label}
          </span>
        )}
      </button>
    </li>
  );
};

export default NavItem;
