const DropdownField = ({ label, value, onChange, options, icon: Icon }) => (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700 flex items-center">
        {Icon && <Icon className="mr-2" />}
        {label}
      </label>
      <select
        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        value={value}
        onChange={onChange}
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
  
  export default DropdownField;