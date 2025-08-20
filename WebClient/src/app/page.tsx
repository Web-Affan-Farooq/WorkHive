import React from "react";
import { Header, Footer } from "@/components/layout";
import { BannerSection, FeaturesSection } from "@/components/pages";

const Home = () => {
  return (
    <main>
      <article>
        <Header />
        <BannerSection />
        <FeaturesSection />
        <Footer />
      </article>
    </main>
  );
};

export default Home;
