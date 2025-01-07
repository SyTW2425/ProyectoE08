export const StatCard = ({title, number}) => {
  return(
    <div className="text-center">
      <h1 className="text-xl max-w-40 font-black">{title.toUpperCase()}</h1>
      <p className="text-8xl font-black">{number}</p>
    </div>
  )
}