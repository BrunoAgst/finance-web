import AddDebit from "./AddDebit";
import ViewDebit from "./ViewDebit";
import UserHeader from "../components/UserHeader";
import logo from "../assets/logo.png";

function Home() {
  return (
    <div className="w-screen h-screen bg-slate-50 flex flex-col gap-10 justify-center items-center p-6 relative">
      <UserHeader />
      <img src={logo} alt="Logo" className="w-32 h-32 mb-2" />
      <AddDebit />
      <ViewDebit />
    </div>
  );
}

export default Home;
