import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/verve/Nav";
import { Hero } from "@/components/verve/Hero";
import { About } from "@/components/verve/About";
import { WhyJoin } from "@/components/verve/WhyJoin";
import { Departments } from "@/components/verve/Departments";
import { Leadership } from "@/components/verve/Leadership";
import { Certification } from "@/components/verve/Certification";
import { GoalsObjectives } from "@/components/verve/GoalsObjectives";
import { Policies } from "@/components/verve/Policies";
import { Process } from "@/components/verve/Process";
import { ApplicationForm } from "@/components/verve/ApplicationForm";
import { SuccessModal } from "@/components/verve/SuccessModal";
import { Footer } from "@/components/verve/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VERVE Recruitment Portal 2026 — St. Xavier's College, Ranchi" },
      {
        name: "description",
        content:
          "Apply to VERVE — the Official Social Media & Digital Media Hub of St. Xavier's College (Autonomous), Ranchi. Create. Innovate. Lead. Inspire.",
      },
      { property: "og:title", content: "VERVE Recruitment Portal 2026" },
      {
        property: "og:description",
        content:
          "Join the Official Social Media & Digital Media Hub of St. Xavier's College, Ranchi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0a1428" },
    ],
  }),
  component: Index,
});

function Index() {
  const [success, setSuccess] = useState(false);
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <About />
      <WhyJoin />
      <Departments />
      <Leadership />
      <Certification />
      <GoalsObjectives />
      <Policies />
      <Process />
      <ApplicationForm onSuccess={() => setSuccess(true)} />
      <Footer />
      <SuccessModal open={success} onClose={() => setSuccess(false)} />
    </main>
  );
}
