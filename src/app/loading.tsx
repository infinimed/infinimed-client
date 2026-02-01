export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-indigo-200">
      <div className="h-full w-2/5 bg-indigo-600 loading-bar-animate" />
    </div>
  );
}
