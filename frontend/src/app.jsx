import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomerList from "./components/CustomerList";
import CustomerDetail from "./components/CustomerDetail";
import FollowupList from "./components/FollowupList";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link
                  to="/"
                  className="flex items-center text-xl font-bold text-blue-600"
                >
                  📊 Mini CRM UMKM
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center px-3 text-gray-700 hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <Link
                  to="/customers"
                  className="inline-flex items-center px-3 text-gray-700 hover:text-blue-600"
                >
                  Pelanggan
                </Link>
                <Link
                  to="/followups"
                  className="inline-flex items-center px-3 text-gray-700 hover:text-blue-600"
                >
                  Follow-up
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/followups" element={<FollowupList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
