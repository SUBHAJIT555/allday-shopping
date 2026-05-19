import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import BestSeller from "./BestSeller";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";
import { Product } from "@/types/product";

interface HomeProps {
  products: Product[];
}

const Home = ({ products }: HomeProps) => {
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 8);
  const bestSellers = products.filter(p => p.isBestSelling).slice(0, 6);

  return (
    <main>
      <Hero />
      <Categories />
      <NewArrival products={newArrivals} />
      <PromoBanner />
      <BestSeller products={bestSellers} />
      <Testimonials />
      <Newsletter />
    </main>
  );
};

export default Home;
