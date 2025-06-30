import type { Route } from "./+types/about";
import AboutUS from "../../components/about/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Us" },
    { name: "description", content: "about this project to React Router!" },
  ];
}

export default function About() {
  return <AboutUS />;
}
