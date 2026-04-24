import { createFileRoute } from "@tanstack/react-router";
import { CustomCursor } from "@/components/portfolio/CustomCursor";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { Experience } from "@/components/portfolio/Experience";
import { Projects } from "@/components/portfolio/Projects";
import { Research } from "@/components/portfolio/Research";
import { Skills } from "@/components/portfolio/Skills";
import { Contact } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Research />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
