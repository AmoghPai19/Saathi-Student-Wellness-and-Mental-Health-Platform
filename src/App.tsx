import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Index from "./pages/Index";
import ChatSupport from "./pages/ChatSupport";
import CounselorBooking from "./pages/CounselorBooking";
import ResourceHub from "./pages/ResourceHub";
import Community from "./pages/Community";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import BubbleWrap from "./components/BubbleWrap";

// Public auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MoodTracker from "./pages/Moodtracker";
import WeeklyReport from "./pages/WeeklyReport"; // <-- New page


// Protected route wrapper
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth & Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mood-tracker" element={<MoodTracker />} />

          {/* Layout-wrapped routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />

            {/* Protected routes for Student + Admin */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute allowedRoles={["student", "admin"]}>
                  <ChatSupport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <ProtectedRoute allowedRoles={["student", "admin"]}>
                  <CounselorBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute allowedRoles={["student", "admin"]}>
                  <ResourceHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute allowedRoles={["student", "admin"]}>
                  <Community />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weekly-report"
              element={
                <ProtectedRoute allowedRoles={["student", "admin"]}>
                  <WeeklyReport /> {/* <-- Added here */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/bubble-wrap"
              element={
                <ProtectedRoute allowedRoles={["student", "admin"]}>
                  <BubbleWrap />
                </ProtectedRoute>
              }
            />

            {/* Admin-only route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
