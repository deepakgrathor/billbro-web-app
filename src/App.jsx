import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import AppNavigate from "./Navigation/AppNavigate";
import SplashScreen from "./Components/SplashScreen";
import { Toaster } from "react-hot-toast";
import DisableInteractionWrapper from "./Utils/DisableInteractionWrapper";
import { useDispatch, useSelector } from "react-redux";
import API from "./Redux/API";
import { useIsMobile } from "./hooks/useIsMobile";

// function DesktopBlockScreen() {
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         flexDirection: "column",
//         padding: "1.5rem",
//         textAlign: "center",
//         fontFamily: "sans-serif",
//       }}
//     >
//       <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
//         Mobile Only Experience
//       </h1>
//       <p style={{ maxWidth: "400px", opacity: 0.8 }}>
//         Ye app abhi sirf mobile view ke liye design ki gayi hai. Kripya ise apne
//         phone ya chhoti screen par open karein. 🙏
//       </p>
//     </div>
//   );
// }

function ActualApp() {
  // yaha tumhara pura React app ka existing code hoga
  return (
    <div>
      {/* tumhara purana app yaha */}
      <h2>Yaha tumhara main mobile-first React app render hoga</h2>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768); // < 768px = mobile
  const [logged, setLogged] = useState(true);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(true);
  const { appDetails } = useSelector((state) => state.PublicSlice);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // 3 sec splash
    return () => clearTimeout(timer);
  }, []);

  // if (!isMobile) {
  //   // Desktop / large screen
  //   return <DesktopBlockScreen />;
  // }

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
