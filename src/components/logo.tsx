const Logo = ({ name }: { name: string }) => {
  return (
    <div className="flex items-center gap-2 p-2">
      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-800">{name}</span>
        <span className="text-xs text-gray-600 truncate max-w-[140px]">
          Society360
        </span>
      </div>
    </div>
  );
};

export default Logo;
