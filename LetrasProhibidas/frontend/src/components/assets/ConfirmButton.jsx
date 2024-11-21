export const ConfirmButton = ({text}) => {
  return (
    <button className={`font-poppins font-black text-2xl p-1 rounded-xl bg-white border-primaryPurple border-[4px]`}>
      <p className="text-primaryPurple">{text}</p>
    </button>
  )
}