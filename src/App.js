import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "/node_modules/primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SignUp from "./SignUp/SignUp";
import FotgotPassword from "./ForgotPassword/FotgotPassword";
import LoginPage from "./loginPage/LoginPage";
import LandingPage from "./landingpage/LandingPage";
import Navbar from "./navbar/Navbar";
import Profile from "./profile/Profile";
import { UserProvider } from "./contextFolder/UserProvider ";
import EditProfile from "./editProfile/EditProfile";
import "./App.css";
import People from "./people/People";
import ViewPeople from "./viewPeople/ViewPeople";
import AddPost from "./addPost/AddPost";
import MyPosts from "./myposts/MyPosts";
import Chat from "./chat/Chat";

function AppContent() {
  const location = useLocation();

  const shouldShowNavbar = () => {
    return (
      location.pathname !== "/" &&
      location.pathname !== "/sign-up" &&
      location.pathname !== "/login" &&
      location.pathname !== "/forgot-password"
    );
  };

  return (
    <div className="App">
      {shouldShowNavbar() && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/forgot-password" element={<FotgotPassword />}></Route>
        <Route path="/linkup" element={<LandingPage />}></Route>
        <Route path="/profile" element={<Profile />}>
          <Route path="my-posts" element={<MyPosts />}></Route>
        </Route>
        <Route path="/edit-profile" element={<EditProfile />}></Route>
        <Route path="/people" element={<People />}></Route>
        <Route path="/newPost" element={<AddPost />}></Route>
        <Route path="/people/:firstNameLastName" element={<ViewPeople />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
          <AppContent />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
