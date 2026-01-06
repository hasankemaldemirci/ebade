/**
 * ebade Token Benchmark
 *
 * Compares token usage between traditional frameworks and ebade
 * for common development tasks.
 *
 * This demonstrates the efficiency of ebade (Agent-First Framework) for AI agents.
 */

// Simple token counter (approximation: ~4 chars per token for code)
function countTokens(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return Math.ceil(cleaned.length / 4);
}

// ============================================
// BENCHMARK 1: Checkout Page
// ============================================

const checkoutBenchmark = {
  name: "Checkout Page",
  description:
    "A checkout page with cart summary, shipping form, payment, and order confirmation",

  nextjs: `// app/checkout/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const { clientSecret } = await fetch("/api/pay").then(r => r.json());
    const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement)! }
    });
    if (paymentIntent?.status === "succeeded") {
      router.push("/success");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay Now</button>
    </form>
  );
}`,

  ebade: `/**
 * @page('/checkout')
 * @ebade('complete-purchase')
 * @requires({ data: ['cart'], features: ['payments'] })
 * @outcomes({ success: { redirect: '/success' } })
 * @compose(['order-summary', 'shipping-form', 'payment-form'])
 */
export function CheckoutPage() {}`,
};

// ============================================
// BENCHMARK 2: Product Listing
// ============================================

const productListingBenchmark = {
  name: "Product Listing with Filters",
  description:
    "A product listing page with search, category filters, and pagination",

  nextjs: `// app/products/page.tsx
"use client";
import { useState, useEffect } from "react";
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ search: "", cat: "" });
  
  useEffect(() => {
    fetch(\`/api/products?s=\${filters.search}&c=\${filters.cat}\`)
      .then(r => r.json()).then(d => setProducts(d));
  }, [filters]);

  return (
    <div>
      <input onChange={e => setFilters({...filters, search: e.target.value})} />
      {products.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}`,

  ebade: `/**
 * @page('/products')
 * @ebade('list-products')
 * @data(({ query }) => db.products.findMany({ 
 *   where: { name: { contains: query.s }, cat: query.c } 
 * }))
 * @compose(['filter-bar', 'product-grid', 'pagination'])
 */
export function ProductsPage() {}`,
};

// ============================================
// BENCHMARK 3: User Authentication
// ============================================

const authBenchmark = {
  name: "User Authentication (Login)",
  description: "A login form with email/password, validation, and redirect",

  nextjs: `// app/login/page.tsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
export default function LoginPage() {
  const [form, setForm] = useState({ email: "", pass: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn("credentials", { ...form, callbackUrl: "/dashboard" });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" onChange={e => setForm({...form, pass: e.target.value})} />
      <button type="submit">Login</button>
    </form>
  );
}`,

  ebade: `/**
 * @page('/login')
 * @ebade('user-login')
 * @validate({ email: ['required', 'email'], pass: ['required'] })
 * @outcomes({ success: { redirect: '/dashboard' } })
 * @compose(['login-form'])
 */
export function LoginPage() {}`,
};

// ============================================
// RUN BENCHMARKS
// ============================================

const benchmarks = [checkoutBenchmark, productListingBenchmark, authBenchmark];

console.log("# ebade Token Efficiency Benchmark Results\n");
console.log("| Task | Next.js Tokens | ebade Tokens | Savings | Efficiency |");
console.log("| :--- | :---: | :---: | :---: | :---: |");

let totalNext = 0;
let totalEbade = 0;

benchmarks.forEach((b) => {
  const nextTokens = countTokens(b.nextjs);
  const ebadeTokens = countTokens(b.ebade);
  const savings = (((nextTokens - ebadeTokens) / nextTokens) * 100).toFixed(1);
  const efficiency = (nextTokens / ebadeTokens).toFixed(1);

  totalNext += nextTokens;
  totalEbade += ebadeTokens;

  console.log(
    `| ${b.name} | ${nextTokens} | ${ebadeTokens} | ${savings}% | ${efficiency}x |`
  );
});

const avgSavings = (((totalNext - totalEbade) / totalNext) * 100).toFixed(1);
const totalEfficiency = (totalNext / totalEbade).toFixed(1);

console.log(
  `| **TOTAL / AVG** | **${totalNext}** | **${totalEbade}** | **${avgSavings}%** | **${totalEfficiency}x** |`
);

console.log("\n## Economic Impact (per 1,000,000 sessions)");
const nextCost = (totalNext * 1000000 * 0.00001).toFixed(2); // $10 per 1M tokens approx
const ebadeCost = (totalEbade * 1000000 * 0.00001).toFixed(2);
const savingsCost = (nextCost - ebadeCost).toFixed(2);

console.log(`- **Next.js Cost:** $${nextCost}`);
console.log(`- **ebade Cost:** $${ebadeCost}`);
console.log(`- **Net Savings:** $${savingsCost} (per million sessions)`);

console.log("\n## Environmental Impact (Green AI)");
const totalCarbonSaved = (totalNext - totalEbade) * 0.000001 * 1000000 * 0.05; // 0.05g CO2 per token saved
console.log(
  `- **Estimated CO2 Saved:** ${totalCarbonSaved.toFixed(
    2
  )} kg per million sessions`
);
