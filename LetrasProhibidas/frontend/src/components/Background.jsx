import { Meteors } from "./Meteors";

export const Background = ({children}) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 bg-secondaryBlue -z-30" />
      <div className="absolute top-40 left-56 w-56 h-56 blur-[140px] bg-primaryPurple -z-20"/>
      <div className="absolute top-96 right-16 w-56 h-56 blur-[140px] bg-primaryPurple -z-20"/>
      <div className="absolute bottom-10 left-96 w-56 h-56 blur-[140px] bg-primaryPurple -z-20"/>
      <div className="absolute inset-0 bg-[url('/public/pattern.jpg')] opacity-[.02] -z-10" />
      <div className="flex items-center justify-center w-full h-full z-10 p-10">
        {children}
      </div>
      <Meteors number={30} className="w-full h-full absolute z-5"/>
    </div>
  );
};
