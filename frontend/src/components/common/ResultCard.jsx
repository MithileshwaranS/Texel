const ResultCard = ({ title, value, icon: Icon, color = "bg-blue-50" }) => (
    <div className={`${color} p-4 rounded-xl shadow-sm border border-gray-200`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600 flex items-center">
          {Icon && <Icon className="mr-2" />}
          {title}
        </h3>
        <span className="text-lg font-semibold text-gray-800">
          {value || "-"}
        </span>
      </div>
    </div>
  );
  
  export default ResultCard;