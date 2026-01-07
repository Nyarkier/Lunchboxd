export function Hero() {
  return (
    <div className="flex items-center justify-center flex-col h-[90vh] w-f bg-[#fbfff1]">
      <div className="text-9xl font-bold m-0 leading-none p-0">lunchboxd</div>
      <div className="text-4xl font-bold text-[#2d5a27] p-1 m-0 leading-none">
        Looking for something to eat today?
      </div>
      <div className="flex flex-row gap-10">
        <button>DIRECTORY</button>
        <button>CANT DECIDE</button>
      </div>
    </div>
  );
}
