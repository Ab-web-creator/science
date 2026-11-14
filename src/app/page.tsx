import { Welcome } from "@/components/learning/welcome";
import { Adventure } from "@/components/learning/adventure";
export default function Home() {
  return (
    <section className="screen-page home-screen home-library">
      <Welcome />
      <Adventure />
    </section>
  );
}
