import seedrandom from 'seedrandom';
import productsData from '@/constants/products.json';
import categoriesData from '@/constants/categoryData';
import { Product } from '@/types/product';

type Category = {
  id: number;
  title: string;
  img: string;
};

const TOTAL_PRODUCTS = 500;

// Number of products to assign each flag
const NEW_ARRIVAL_COUNT = 50;
const BEST_SELLING_COUNT = 50;
const TRENDING_COUNT = 50;

function seededShuffle<T>(array: T[], seed: string): T[] {
  const rng = seedrandom(seed);
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

function selectFromCategory(
  categoryProducts: Product[],
  count: number,
  seed: string
): Product[] {
  if (categoryProducts.length <= count) {
    return [...categoryProducts];
  }
  
  const shuffled = seededShuffle(categoryProducts, seed);
  return shuffled.slice(0, count);
}

export function selectProducts(siteNumber: number): Product[] {
  const products = productsData as Product[];
  const categories = categoriesData as Category[];
  
  const quotaPerCategory = Math.floor(TOTAL_PRODUCTS / categories.length);
  const selectedProducts: Product[] = [];
  const usedProductIds = new Set<number>();
  
  const categorySeed = `site-${siteNumber}-category`;
  const globalSeed = `site-${siteNumber}-global`;
  const finalSeed = `site-${siteNumber}-final`;
  
  const productsByCategory = new Map<number, Product[]>();
  
  categories.forEach(category => {
    productsByCategory.set(
      category.id,
      products.filter(p => p.categoryId === category.id)
    );
  });
  
  categories.forEach(category => {
    const categoryProducts = productsByCategory.get(category.id) || [];
    const availableProducts = categoryProducts.filter(p => !usedProductIds.has(p.id));
    
    const needed = quotaPerCategory;
    const selected = selectFromCategory(
      availableProducts,
      needed,
      `${categorySeed}-${category.id}`
    );
    
    selected.forEach(product => {
      selectedProducts.push(product);
      usedProductIds.add(product.id);
    });
  });
  
  const remainingNeeded = TOTAL_PRODUCTS - selectedProducts.length;
  
  if (remainingNeeded > 0) {
    const availableProducts = products.filter(p => !usedProductIds.has(p.id));
    const shuffled = seededShuffle(availableProducts, globalSeed);
    const additional = shuffled.slice(0, remainingNeeded);
    
    selectedProducts.push(...additional);
  }
  
  const finalProducts = seededShuffle(selectedProducts, finalSeed);
  
  // Randomly assign flags based on site number
  const flagsSeed = `site-${siteNumber}-flags`;
  const flagsRng = seedrandom(flagsSeed);
  
  // Reset all flags first
  finalProducts.forEach(product => {
    product.isNewArrival = false;
    product.isBestSelling = false;
    product.isTrending = false;
  });
  
  // Create a shuffled copy of indices for flag assignment
  const indices = finalProducts.map((_, index) => index);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(flagsRng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  // Assign new arrival flag
  for (let i = 0; i < Math.min(NEW_ARRIVAL_COUNT, indices.length); i++) {
    finalProducts[indices[i]].isNewArrival = true;
  }
  
  // Assign best selling flag (skip already assigned new arrivals)
  let bestSellingAssigned = 0;
  for (let i = 0; i < indices.length && bestSellingAssigned < BEST_SELLING_COUNT; i++) {
    if (!finalProducts[indices[i]].isNewArrival) {
      finalProducts[indices[i]].isBestSelling = true;
      bestSellingAssigned++;
    }
  }
  
  // Assign trending flag (skip already assigned new arrivals and best selling)
  let trendingAssigned = 0;
  for (let i = 0; i < indices.length && trendingAssigned < TRENDING_COUNT; i++) {
    if (!finalProducts[indices[i]].isNewArrival && !finalProducts[indices[i]].isBestSelling) {
      finalProducts[indices[i]].isTrending = true;
      trendingAssigned++;
    }
  }
  
  return finalProducts;
}
