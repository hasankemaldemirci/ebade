/**
 * Generate Tool
 *
 * Generates a component from a natural language description.
 * This is the "magic" tool where AI meets ebade.
 */

interface GenerateArgs {
  description: string;
  style?: "minimal-modern" | "bold-vibrant" | "dark-premium" | "glassmorphism";
}

// Pattern matching for common component types
const componentPatterns: Array<{
  keywords: string[];
  type: string;
  template: (desc: string, style: string) => { intent: any; code: string };
}> = [
  {
    keywords: ["product", "card", "item", "listing"],
    type: "product-card",
    template: (desc, style) => ({
      intent: {
        type: "component",
        name: "product-card",
        displays: ["image", "title", "price", "rating"],
        actions: ["add-to-cart", "add-to-wishlist"],
        style: style,
      },
      code: `"use client";

import Image from "next/image";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image">
        <Image 
          src={product.image} 
          alt={product.name}
          fill
          className="object-cover"
        />
        {isHovered && (
          <button 
            className="quick-add"
            onClick={() => onAddToCart?.(product)}
          >
            Quick Add
          </button>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        {product.rating && (
          <div className="product-rating">
            {"★".repeat(Math.floor(product.rating))}
            {"☆".repeat(5 - Math.floor(product.rating))}
          </div>
        )}
        <p className="product-price">\${product.price.toFixed(2)}</p>
      </div>
      <button 
        className="add-to-cart"
        onClick={() => onAddToCart?.(product)}
      >
        Add to Cart
      </button>
    </article>
  );
}`,
    }),
  },
  {
    keywords: ["hero", "header", "banner", "landing"],
    type: "hero-section",
    template: (desc, style) => ({
      intent: {
        type: "component",
        name: "hero-section",
        displays: ["headline", "subheadline", "cta"],
        style: style,
      },
      code: `"use client";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function HeroSection({
  title = "Welcome to Our Platform",
  subtitle = "Discover amazing features that will transform your workflow",
  ctaText = "Get Started",
  ctaHref = "/signup",
}: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        <div className="hero-actions">
          <a href={ctaHref} className="btn btn-primary btn-lg">
            {ctaText}
          </a>
          <a href="#learn-more" className="btn btn-secondary btn-lg">
            Learn More
          </a>
        </div>
      </div>
      <div className="hero-decoration" aria-hidden="true" />
    </section>
  );
}`,
    }),
  },
  {
    keywords: ["form", "contact", "input", "submit"],
    type: "contact-form",
    template: (desc, style) => ({
      intent: {
        type: "component",
        name: "contact-form",
        fields: ["name", "email", "message"],
        validation: ["required", "email-format"],
        outcomes: {
          success: "show-toast",
          error: "show-inline",
        },
        style: style,
      },
      code: `"use client";

import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.message) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={errors.name ? "error" : ""}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={errors.email ? "error" : ""}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={errors.message ? "error" : ""}
          rows={5}
        />
        {errors.message && <span className="error-message">{errors.message}</span>}
      </div>

      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>

      {status === "success" && (
        <div className="success-message">Message sent successfully!</div>
      )}
      {status === "error" && (
        <div className="error-message">Failed to send. Please try again.</div>
      )}
    </form>
  );
}`,
    }),
  },
  {
    keywords: ["cart", "basket", "shopping"],
    type: "shopping-cart",
    template: (desc, style) => ({
      intent: {
        type: "component",
        name: "shopping-cart",
        displays: ["items", "quantities", "total"],
        actions: ["update-quantity", "remove-item", "checkout"],
        style: style,
      },
      code: `"use client";

import { useState } from "react";
import Image from "next/image";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShoppingCartProps {
  initialItems?: CartItem[];
  onCheckout?: (items: CartItem[]) => void;
}

export function ShoppingCart({ initialItems = [], onCheckout }: ShoppingCartProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty</p>
        <a href="/products" className="btn">Continue Shopping</a>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <ul className="cart-items">
        {items.map(item => (
          <li key={item.id} className="cart-item">
            <Image src={item.image} alt={item.name} width={80} height={80} />
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>\${item.price.toFixed(2)}</p>
            </div>
            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>
            <button className="remove-btn" onClick={() => removeItem(item.id)}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span>\${total.toFixed(2)}</span>
        </div>
        <button 
          className="checkout-btn"
          onClick={() => onCheckout?.(items)}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}`,
    }),
  },
];

// Default component template
const defaultTemplate = (description: string, style: string) => ({
  intent: {
    type: "component",
    name: description.toLowerCase().replace(/\s+/g, "-").substring(0, 30),
    description: description,
    style: style,
  },
  code: `"use client";

/**
 * Generated component from description:
 * "${description}"
 */

interface ComponentProps {
  className?: string;
}

export function GeneratedComponent({ className }: ComponentProps) {
  return (
    <div className={\`generated-component \${className || ""}\`}>
      {/* 
        TODO: Implement based on description:
        "${description}"
      */}
      <p>Component placeholder</p>
    </div>
  );
}`,
});

export async function generateComponent(args: GenerateArgs) {
  const { description, style = "minimal-modern" } = args;
  const lowerDesc = description.toLowerCase();

  // Find matching pattern
  let result;
  for (const pattern of componentPatterns) {
    if (pattern.keywords.some((kw) => lowerDesc.includes(kw))) {
      result = pattern.template(description, style);
      break;
    }
  }

  // Use default if no pattern matches
  if (!result) {
    result = defaultTemplate(description, style);
  }

  return {
    content: [
      {
        type: "text",
        text: `✅ Generated component from description

📝 Description: "${description}"
🎨 Style: ${style}

📋 Inferred ebade:
\`\`\`json
${JSON.stringify(result.intent, null, 2)}
\`\`\`

💻 Generated Code:
\`\`\`typescript
${result.code}
\`\`\`

💡 Tip: You can refine this by providing more specific descriptions or using the ebade_compile tool directly with a custom ebade definition.
`,
      },
    ],
  };
}
