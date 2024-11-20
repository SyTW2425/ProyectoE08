import { Meteors } from "./Meteors";

export const Background = ({children}) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-primaryPurple to-secondaryBlue -z-20" />
      <div className="absolute inset-0 bg-[url('/public/pattern.jpg')] opacity-[.02] -z-10" />
      <div className="flex items-center justify-center w-full h-full z-10 p-10">
        {children}
      </div>
      <Meteors number={30} className="w-full h-full absolute z-5"/>
    </div>
  );
};
