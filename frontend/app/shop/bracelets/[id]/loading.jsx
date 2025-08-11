export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#18181b] px-4 py-8">
      <div className="bg-[#232326]/60 rounded-2xl shadow-2xl px-8 py-12 border border-[#bcbcbc33] backdrop-blur-md backdrop-saturate-150 w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bcbcbc] mb-6"></div>
          <p className="text-center text-[#f8f8f8] font-medium text-lg">Loading Product...</p>
          <p className="text-center text-[#bcbcbc] text-sm mt-2">Preparing your jewelry details</p>
        </div>
      </div>
    </div>
  );
}
