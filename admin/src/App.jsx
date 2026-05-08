import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useRoutes,
} from "react-router-dom";
import { useEffect } from "react";

// Context
import { AuthProvider } from "./context/AuthContext";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import UserLocationManager from "./components/UserLocationManager";

// Home Sections
import HeroSection from "./components/HeroSection";
import MealPlans from "./components/MealPlans";
import Card from "./components/Cards";
import Testimonials from "./components/Testimonials";

// Public Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Recipes from "./pages/Recipes";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import FAQs from "./pages/FAQs";
import Profile from "./pages/Profile";

// Meal Plan Pages
import HighProteinPlanCard from "./pages/HighProteinPlan";
import WeightlossPlanCard from "./pages/WeightlossPlanCard";
import DiabeticDietPlan from "./pages/DiabeticDietPlan";
import CustomMealPlanCard from "./pages/CustomMealPlan";
import SubscribeConfirm from "./pages/SubscribeConfirm";
import MyMealPlans from "./pages/MyMealPlans";
import EmployeePlan from "./pages/EmployeePlan";
import PaymentPage from "./pages/PaymentPage";
import WeightlossMealPlan from "./pages/WeightlossMealPlan";
import BalancedDietPlan from "./pages/BalancedDietPlan";
import MuscleGainMealPlan from "./pages/MuscleGainMealPlan";
import OfficeMenuPlan from "./pages/OfficeMenuPlan";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import PlansPage from "./pages/PlansPage";
import CouponsPage from "./pages/CouponsPage";
import TransactionsPage from "./pages/TransactionsPage";
import SubscriptionTable from "./components/SubscriptionTable";
import SettingsPage from "./pages/SettingsPage";
import RevenuePage from "./pages/RevenuePage";
import AdminUsers from "./pages/AdminUsers";

// 404 Page
const NotFoundPage = () => (
  <div className="p-10 text-center text-xl text-red-500 font-semibold">
    404 - Page Not Found
  </div>
);

// Layout Wrapper with conditional navbar/footer
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const is404Page = location.pathname === "/404";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const shouldHideLayout = isAdminPage || is404Page;

  return (
    <div className="font-sans flex flex-col min-h-screen">
      {!shouldHideLayout && <Navbar />}
      <div className="flex-grow">{children}</div>
      {!shouldHideLayout && <Footer />}
      {!shouldHideLayout && <UserLocationManager />}
    </div>
  );
};

function AppRoutes() {
  const location = useLocation();

  return (
    <LayoutWrapper>
      <ScrollToTop />
      <Routes location={location}>
        {/* 🏠 Home Page */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <MealPlans />
              <Card />
              <Testimonials />
            </>
          }
        />

        {/* 🔓 Public Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/profile" element={<Profile />} />

        {/* 🥗 Meal Plan Pages */}
        <Route path="/high-protein-plan" element={<HighProteinPlanCard />} />
        <Route path="/weightloss-plan" element={<WeightlossPlanCard />} />
        <Route path="/diabetic-plan" element={<DiabeticDietPlan />} />
        <Route path="/meal-plan" element={<MealPlans />} />
        <Route path="/custom-meal-plan" element={<CustomMealPlanCard />} />
        <Route path="/subscribe-confirm" element={<SubscribeConfirm />} />
        <Route path="/my-meal-plans" element={<MyMealPlans />} />
        <Route path="/employee-meal-plan" element={<EmployeePlan />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/weightloss-meal-plan" element={<WeightlossMealPlan />} />
        <Route path="/balanced-diet-plan" element={<BalancedDietPlan />} />
        <Route path="/muscle-gain-meal-plan" element={<MuscleGainMealPlan />} />
        <Route path="/office-menu-plan" element={<OfficeMenuPlan />} />

        {/* 🔐 Admin Section (No Navbar/Footer) */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="subscriptions" element={<SubscriptionTable />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* 🔁 Redirect */}
        <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />

        {/* 🔴 Global 404 */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </LayoutWrapper>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
