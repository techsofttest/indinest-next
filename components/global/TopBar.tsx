export default function TopBar() {
  return (
    <div className="hidden md:flex justify-between items-center px-8 py-2 text-[10px] uppercase tracking-widest border-b border-[#010526]/10">
      <div className="flex gap-6">
        <a href="#" className="font-bold">Women</a>
        <a href="#" className="text-[#010526]/60 hover:text-[#010526]">Men</a>
        <a href="#" className="text-[#010526]/60 hover:text-[#010526]">Kids</a>
        <a href="#" className="text-[#010526]/60 hover:text-[#010526]">Life</a>
      </div>
      <div className="text-[#010526]/60">The finest edit in Indian luxury</div>
      <div className="flex gap-4">
        <a href="#" className="hover:underline underline-offset-4">India | English</a>
      </div>
    </div>
  );
}
