function Header() {
  return (
    <header className="bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Left side: Title and Subtitle */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            HydroEdge
          </h1>
          <p className="text-sm text-slate-400">
            AI-Driven Irrigation Simulation Dashboard
          </p>
        </div>

        {/* Right side: Live Status Indicator */}
        <div className="flex items-center space-x-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <span className="text-green-400 font-semibold">
            Live Simulation
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;