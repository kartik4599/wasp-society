export const Loading = () => {
  return (
    <div className={`flex items-center justify-center h-[90vh] space-x-3`}>
      <div className="size-5 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.3s]" />
      <div className="size-5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
      <div className="size-5 animate-bounce rounded-full bg-pink-400" />
    </div>
  );
};
