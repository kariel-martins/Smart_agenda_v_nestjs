import { useEffect, useState } from "react";

export function ErrorMessage({ message }: { message: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if(!message) return

    setShow(true)
    
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

  if (!show) return null;

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-red-50 border-l-4 border-red-500 text-red-800 shadow-lg rounded-md animate-in fade-in slide-in-from-top-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-red-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
