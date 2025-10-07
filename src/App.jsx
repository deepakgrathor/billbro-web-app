import { useEffect, useState } from "react";

// import { useDispatch } from "react-redux";
import AppNavigate from "./Navigation/AppNavigate";
import SplashScreen from "./Components/SplashScreen";
import { Toaster } from "react-hot-toast";
import DisableInteractionWrapper from "./Utils/DisableInteractionWrapper";

function App() {
  // const dispatch = useDispatch();
  const [logged, setLogged] = useState(true);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // 3 sec splash
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <DisableInteractionWrapper>
        <Toaster position="bottom-center" reverseOrder={false} />
        {loading ? <SplashScreen /> : <AppNavigate />}
      </DisableInteractionWrapper>
    </>
  );
}

export default App;
