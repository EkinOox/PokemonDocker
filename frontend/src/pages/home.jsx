import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/nav";
import Banner from "../components/banner";
import Footer from "../components/footer";

const Home = () => {
  const [generations] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name);
    }else{
      navigate('/connexion');
    }
  }, []);


  const handleClick = (genId) => {
    navigate(`/pokemon-gen/${genId}`);
  };

  return (
    <div className="bg-gray-200">
      <Navbar />
      <Banner name="" />
      <h2 className="w-full text-center m-4 text-2xl">
        Vous pouvez choisir la génération que vous voulez.
      </h2>
      <div className="grid grid-cols-3 gap-5">
        {generations.map((genId) => (
          <div
            key={genId}
            className="m-3 shadow-md rounded-lg cursor-pointer"
            onClick={() => handleClick(genId)}
          >
            <img
              className="rounded-lg"
              src={`./assets/image/${genId}.jpg`}
              alt={`Generation ${genId}`}
            />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
