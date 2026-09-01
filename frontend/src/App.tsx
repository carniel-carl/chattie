import { Navigate, Route, Routes } from "react-router";
import HomePage from "@/pages/Homepage.tsx";
import ChatPage from "@/pages/ChatPage.tsx";
import { useAuth } from "@clerk/react";
import PageLoader from "@/components/shared/Preloader";
import useUserSync from "./hooks/useUserSync";

function App() {
  const { isLoaded, isSignedIn } = useAuth();
  useUserSync();

  if (!isLoaded) return <PageLoader />;

  return (
    <Routes>
      <Route
        path="/"
        element={!isSignedIn ? <HomePage /> : <Navigate to={"/chat"} />}
      />
      <Route
        path="/chat"
        element={isSignedIn ? <ChatPage /> : <Navigate to={"/"} />}
      />
    </Routes>
  );
}

export default App;
