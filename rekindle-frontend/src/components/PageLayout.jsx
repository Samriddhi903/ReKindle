import { Navbar } from './Navbar';

export function PageLayout({ children, sticker }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-lexend text-blue-900 relative overflow-hidden pt-24">
      <Navbar />
      {sticker && (
        <img src={sticker} alt="" className="max-w-[30vw] w-60 md:w-96 absolute bottom-0 right-0 mb-4 mr-[-10px] drop-shadow-2xl pointer-events-none select-none" aria-hidden="true" />
      )}
      <div className="z-10 w-full flex flex-col items-center justify-center">{children}</div>
    </div>
  );
} 