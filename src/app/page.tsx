
import { Hero } from "@/components/Hero";
import { Box } from "@/styles/box";

export default function Home() {
  return (
    <Box as="main">
      <div className="md:mt-12 mt-2">
        <Hero />
      </div>
    </Box>
  );
}
