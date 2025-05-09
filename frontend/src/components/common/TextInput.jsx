import { FaToolbox } from "react-icons/fa";

const TextInput = ({ label, value, onChange, icon: Icon = FaToolbox, ...props }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700 flex items-center">
      {Icon && <Icon className="mr-2" />}
      {label}
    </label>
    <input
      className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      value={value}
      onChange={onChange}
      min = {min}
      {...props}
    />
  </div>
);

export default TextInput;