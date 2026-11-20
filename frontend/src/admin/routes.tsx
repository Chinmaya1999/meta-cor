import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth";
import { AdminLayout } from "./Layout";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { ServicesAdmin, TeamAdmin, ArticlesAdmin, EnquiriesAdmin, BookingsAdmin, SubscribersAdmin, MediaAdmin, SettingsAdmin, UsersAdmin, ActivityAdmin } from "./Pages";

export default function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="team" element={<TeamAdmin />} />
          <Route path="articles" element={<ArticlesAdmin />} />
          <Route path="media" element={<MediaAdmin />} />
          <Route path="enquiries" element={<EnquiriesAdmin />} />
          <Route path="bookings" element={<BookingsAdmin />} />
          <Route path="subscribers" element={<SubscribersAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="activity" element={<ActivityAdmin />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
