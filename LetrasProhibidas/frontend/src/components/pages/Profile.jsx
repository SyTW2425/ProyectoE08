import { useEffect, useState } from "react";
import { StatCard } from "../assets/StatCard";
import { StandardButton } from "../assets/StandardButton";
import { useNavigate } from "react-router-dom";
import { avatars } from "../../utils/avatars";
import { RandomButton } from "../assets/RandomButton";
import { Loader } from "../assets/Loader";

export const Profile = () => {
  const [userData, setUserData] = useState();
  const [avatar, setAvatar] = useState(avatars[0]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("userID");
      if (token) {
        try {
          const response = await fetch(`http://localhost:5000/user/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const result = await response.json();
            setUserData(result);
          } else {
            console.log("error");
          }
        } catch (err) {
          console.log(err);
        }
      } else console.log("error");
    };
    fetchData();
  }, []);

  const handleClick = () => {
    let index = 0;
    while (avatars[index] === avatar) {
      index = Math.floor(Math.random() * avatars.length);
    }
    setAvatar(avatars[index]);
    setUserData((prevData) => ({
      ...prevData,
      avatarSrc: avatars[index],
    }));
  };

  return (
    <div>
      {userData ? (
        <div>
          <div>
            <div className="h-[40rem] w-[60rem] border-[10px] p-5 rounded-xl border-white/10 backdrop-blur-xl flex flex-col items-center justify-start shadow-xl font-poppins text-white">
              <h1 className="text-[64px] font-black">
                <span className="text-white">¡HOLA</span>{" "}
                <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">
                  {userData.name.toUpperCase()}
                </span>
                !
              </h1>
              <div className="h-full w-[50rem] flex flex-row gap-4 items-center justify-start p-3">
                <div className="flex h-full w-full items-center flex-col gap-10">
                  <div className="relative flex flex-col items-center gap-4">
                    <div className="w-56 h-56 flex items-center justify-center border-white border-[7px] rounded-full">
                      {loading && (
                        <div className="w-10 h-10 border-4 border-t-4 border-t-white border-gray-200 rounded-full animate-spin"></div>
                      )}
                      <img
                        src={userData.avatarSrc}
                        className={`rounded-full ${
                          loading ? "hidden" : "block"
                        }`}
                        onLoad={() => setLoading(false)}
                        onError={() => setLoading(false)}
                      />
                    </div>
                    <RandomButton
                      className="absolute top-0 right-0"
                      onClick={handleClick}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <StatCard
                      title="partidas jugadas"
                      number={userData.gamesPlayed}
                    />
                    <StatCard
                      title="partidas ganadas"
                      number={userData.gamesWon}
                    />
                    <StatCard
                      title="palabras acertadas"
                      number={userData.wordsGuessed}
                    />
                  </div>
                </div>
              </div>
              <StandardButton
                text="Volver"
                onClick={() => navigate("/")}
              />
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};
