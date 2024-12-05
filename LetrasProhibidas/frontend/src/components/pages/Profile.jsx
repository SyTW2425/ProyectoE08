export const Profile = ({userInfo}) => {
  const info = JSON.stringify(userInfo)
  return (
    <div>
      {info}
    </div>
  )
}