import StudentForm from "../../components/Attendance/StudentForm";
import { PageLayout, SectionContainer, PremiumCard } from "../../components/dashboard/shared/Primitives";

function AddStudent() {
  return (
    <PageLayout className="attendance-module">
      <div className="page-header">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">Add Student</h1>
        <p className="text-sm text-muted-foreground mt-1">Register a new student into the attendance system</p>
      </div>
      <SectionContainer>
        <div className="max-w-[720px]">
          <PremiumCard hoverEffect={false}>
            <StudentForm />
          </PremiumCard>
        </div>
      </SectionContainer>
    </PageLayout>
  );
}

export default AddStudent;