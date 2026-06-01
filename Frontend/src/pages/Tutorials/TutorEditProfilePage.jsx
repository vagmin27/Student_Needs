import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import TutorProfileView from "@/components/profile/TutorProfileView.jsx";

function TutorEditProfilePage() {
  return (
    <DashboardLayout pageTitle="Edit Profile" role="tutor">
      <TutorProfileView />
    </DashboardLayout>
  );
}

export default TutorEditProfilePage;