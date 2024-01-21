import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ApplyForm from "./views/applyForm";
import CollectionDetail from "./views/collection";
import Collections from "./views/collections";
import Home from "./views/home";
import Verifyme from "./views/verifyme";

function App() {
  return (
    <div className="bg-gray-900 flex flex-col min-h-screen font-roboto">
      <ToastContainer
        pauseOnFocusLoss={false}
        closeOnClick
        draggable
        pauseOnHover={false}
        position="bottom-right"
        rtl={false}
        hideProgressBar={false}
        autoClose={3500}
        newestOnTop={true}
        theme="dark"
      />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<ApplyForm />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collection/:id" element={<CollectionDetail />} />
          <Route path="/verifyme/:slug" element={<Verifyme />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
