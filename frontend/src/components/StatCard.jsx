function StatCard({ icon, title, value, unit, colorClass = 'text-slate-800' }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
      {/* Icon */}
      <div className="bg-slate-100 p-3 rounded-full">
        {icon}
      </div>
      
      {/* Title and Value */}
      <div>
        <h3 className="text-base font-semibold text-slate-500">{title}</h3>
        <p className={`text-3xl font-bold ${colorClass}`}>
          {value}
          {unit && <span className="text-lg font-medium ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

export default StatCard;