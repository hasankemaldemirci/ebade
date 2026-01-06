# ebade Syntax Specification 📖

> **Code is a function of ebade.**
> `Code = f(ebade)`

This document defines the syntax and decorators used in ebade to define application intents.

## Core Principle: ebb-and-flow of intent

In ebade, you don't write implementation details. You define the **intent** of a component, page, or API. The ebade compiler then transforms this intent into framework-specific code (e.g., Next.js, Vue, Svelte).

---

## File Extensions

- `.intent.js` / `.intent.ts` — ebade definitions
- `.intent.yaml` — Declarative ebade configs
- `ebade.config.js` — Project-level ebade configuration

---

## 🏗️ Project Intent (`project.intent.yaml`)

The project-level ebade defines the overall structure and features of the application.

```yaml
name: my-app
type: saas-dashboard | e-commerce | blog | landing-page | portfolio
features:
  - user-auth
  - payments
  - analytics
  - search
  - database
```

---

## Decorators

### @page(path)

Defines a page/route.

```typescript
@page('/products')
@page('/products/[id]')
@page('/users/[userId]/orders/[orderId]')
```

### @intent(name)

Declares the purpose of this component/page.

```typescript
@intent('product-listing')
@intent('user-authentication')
@intent('checkout-flow')
```

### @requires(dependencies)

Specifies what this ebade needs to function.

```typescript
@requires({
  data: ['products', 'categories'],    // Data dependencies
  auth: 'required' | 'optional' | 'none',
  permissions: ['admin', 'editor'],
  features: ['dark-mode', 'analytics']
})
```

### @outcomes(results)

Defines possible outcomes and their handlers.

```typescript
@outcomes({
  success: '/success-page',
  success: { redirect: '/dashboard', toast: 'Welcome!' },
  error: { show: 'inline', retry: true },
  loading: { skeleton: true },
  empty: { message: 'No items found', action: 'create-first' }
})
```

### @data(fetcher)

Defines how to fetch data for this ebade.

```typescript
@data(async ({ params, query }) => {
  return db.products.findMany({ 
    where: { category: params.category },
    limit: query.limit || 20
  });
})
```

### @validate(rules)

Input validation rules.

```typescript
@validate({
  email: ['required', 'email'],
  password: ['required', 'min:8', 'has-uppercase', 'has-number'],
  age: ['required', 'number', 'min:18']
})
```

### @style(design)

Visual styling from design system.

```typescript
@style('card/elevated')
@style({ variant: 'primary', size: 'lg', rounded: true })
```

### @compose(intents)

Combines multiple ebade definitions.

```typescript
@compose(['header', 'sidebar', 'main-content', 'footer'])
```

### @on(event, handler)

Event handlers.

```typescript
@on('submit', async (data) => createOrder(data))
@on('error', (e) => logError(e))
```

### @expects(scenarios)

Defines expected behaviors for testing. **Tests become part of the ebade.**

```typescript
@expects([
  {
    scenario: 'happy-path',
    given: { productId: 1, quantity: 2 },
    when: 'add-to-cart',
    then: 'cart-updated',
    assert: { cartCount: 2 }
  },
  {
    scenario: 'out-of-stock',
    given: { productId: 1, stock: 0 },
    when: 'add-to-cart',
    then: 'error',
    error: 'Product is out of stock'
  },
  {
    scenario: 'invalid-quantity',
    given: { productId: 1, quantity: -1 },
    when: 'add-to-cart',
    then: 'error',
    error: 'Quantity must be positive'
  }
])
```

This automatically generates test files during compilation:

```typescript
// Generated: add-to-cart.test.ts

describe('add-to-cart', () => {
  it('happy-path: should update cart', async () => {
    const result = await addToCart({ productId: 1, quantity: 2 });
    expect(result.outcome).toBe('cart-updated');
    expect(result.cartCount).toBe(2);
  });

  it('out-of-stock: should show error', async () => {
    const result = await addToCart({ productId: 1, stock: 0 });
    expect(result.outcome).toBe('error');
    expect(result.error).toBe('Product is out of stock');
  });

  it('invalid-quantity: should reject negative', async () => {
    const result = await addToCart({ productId: 1, quantity: -1 });
    expect(result.outcome).toBe('error');
    expect(result.error).toBe('Quantity must be positive');
  });
});
```

#### Full Example with @expects

```typescript
// auth/login.intent.ts

@intent('user-login')
@inputs({
  email: { type: 'email', required: true },
  password: { type: 'password', required: true }
})
@validate({
  email: ['required', 'email'],
  password: ['required', 'min:8']
})
@expects([
  {
    scenario: 'valid-credentials',
    given: { email: 'user@test.com', password: 'ValidPass123' },
    mocks: { db: { user: { id: 1, verified: true } } },
    then: 'success',
    assert: { redirect: '/dashboard' }
  },
  {
    scenario: 'invalid-password',
    given: { email: 'user@test.com', password: 'wrong' },
    mocks: { db: { user: null } },
    then: 'error',
    error: 'Invalid email or password'
  },
  {
    scenario: 'unverified-email',
    given: { email: 'new@test.com', password: 'ValidPass123' },
    mocks: { db: { user: { id: 2, verified: false } } },
    then: 'redirect',
    assert: { redirect: '/verify-email' }
  },
  {
    scenario: 'rate-limited',
    given: { email: 'user@test.com', password: 'wrong' },
    context: { failedAttempts: 5 },
    then: 'error',
    error: 'Too many attempts. Try again later.'
  }
])
@outcomes({
  success: { redirect: '/dashboard', toast: 'Welcome back!' },
  error: { show: 'inline' },
  redirect: { to: 'context.redirect' }
})
export function LoginForm({ onSubmit }) {
  // Business logic only
}
```

#### Why Tests in ebade?

| Traditional | ebade |
|-------------|----------|
| Write code, then write tests | Define expectations upfront |
| Tests in separate files | Tests in same definition |
| Easy to forget edge cases | Edge cases are first-class |
| Tests as afterthought | Tests as specification |

> **ebade-Driven Testing**: You're not testing code, you're testing ebade.

---

## Component Definition

### Basic Component

```typescript
// product-card.intent.ts

@intent('display-product')
@displays(['image', 'title', 'price', 'rating'])
@actions(['add-to-cart', 'add-to-wishlist', 'quick-view'])
@style('e-commerce/product-card')
export function ProductCard({ product }) {
  // Only business logic, no boilerplate
}
```

### Page Definition

```typescript
// checkout.intent.ts

@page('/checkout')
@intent('complete-purchase')
@requires({ 
  data: ['cart', 'user'],
  auth: 'required'
})
@outcomes({
  success: '/orders/[orderId]',
  paymentFailed: { show: 'error', retry: true },
  cartEmpty: { redirect: '/products', message: 'Your cart is empty' }
})
@compose([
  'order-summary',
  'shipping-form',
  'payment-form',
  'place-order-button'
])
export function CheckoutPage({ cart, user }) {
  return <CheckoutFlow cart={cart} user={user} />;
}
```

### Form Definition

```typescript
// contact-form.intent.ts

@intent('collect-contact-info')
@fields({
  name: { type: 'text', required: true, label: 'Full Name' },
  email: { type: 'email', required: true },
  message: { type: 'textarea', required: true, rows: 5 },
  category: { 
    type: 'select', 
    options: ['support', 'sales', 'feedback'],
    default: 'support'
  }
})
@validate({
  name: ['required', 'min:2'],
  email: ['required', 'email'],
  message: ['required', 'min:10']
})
@on('submit', async (data) => sendContactForm(data))
@outcomes({
  success: { show: 'toast', message: 'Message sent!' },
  error: { show: 'inline' }
})
export function ContactForm() {}
```

---

## Data Intents

```typescript
// data/products.intent.ts

@dataSource('products')
@provider('supabase')
@table('products')
@schema({
  id: 'uuid',
  name: 'string',
  price: 'decimal',
  category: 'string',
  stock: 'integer',
  images: 'array<string>',
  createdAt: 'timestamp'
})
@queries({
  list: { orderBy: 'createdAt', limit: 20 },
  byCategory: (category) => ({ where: { category } }),
  search: (term) => ({ where: { name: { contains: term } } })
})
export const ProductsData = defineData();
```

---

## API Intents

```typescript
// api/orders.intent.ts

@api('/api/orders')
@intent('order-management')
@auth('required')

@get('/')
@returns('Order[]')
async function listOrders({ user }) {
  return db.orders.findMany({ where: { userId: user.id } });
}

@post('/')
@validate({ items: 'required', shippingAddress: 'required' })
@returns('Order')
async function createOrder({ body, user }) {
  return db.orders.create({ ...body, userId: user.id });
}

@get('/[id]')
@returns('Order')
async function getOrder({ params, user }) {
  return db.orders.findOne({ id: params.id, userId: user.id });
}
```

---

## Layout Intents

```typescript
// layouts/main.intent.ts

@layout('main')
@compose([
  { slot: 'header', intent: 'navigation-header' },
  { slot: 'sidebar', intent: 'main-sidebar', show: 'desktop-only' },
  { slot: 'main', intent: 'page-content' },
  { slot: 'footer', intent: 'site-footer' }
])
@style('layout/dashboard')
export function MainLayout({ children }) {
  return children;
}
```

---

## Full Example: E-commerce Product Page

```typescript
// products/[id].intent.ts

@page('/products/[id]')
@intent('view-product-details')
@data(async ({ params }) => ({
  product: await db.products.findUnique({ id: params.id }),
  reviews: await db.reviews.findMany({ productId: params.id }),
  related: await db.products.findRelated(params.id, { limit: 4 })
}))
@outcomes({
  notFound: '/404',
  success: 'render'
})
@seo(({ product }) => ({
  title: product.name,
  description: product.description,
  image: product.images[0]
}))
@compose([
  'product-gallery',
  'product-info',
  'add-to-cart-section',
  'product-tabs',     // description, specs, reviews
  'related-products'
])
export function ProductPage({ product, reviews, related }) {
  return (
    <ProductPageLayout>
      <ProductGallery images={product.images} />
      <ProductInfo product={product} />
      <AddToCart product={product} />
      <ProductTabs description={product.description} reviews={reviews} />
      <RelatedProducts products={related} />
    </ProductPageLayout>
  );
}
```

---

## Compiler Output

The above intent compiles to standard Next.js/React:

```typescript
// Compiled: app/products/[id]/page.tsx

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
// ... 50+ lines of imports

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await db.products.findUnique({ id: params.id });
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.images[0]] }
  };
}

export default async function ProductPage({ params }) {
  const product = await db.products.findUnique({ id: params.id });
  if (!product) notFound();
  
  const reviews = await db.reviews.findMany({ productId: params.id });
  const related = await db.products.findRelated(params.id, { limit: 4 });
  
  return (
    <ProductPageLayout>
      {/* ... full implementation */}
    </ProductPageLayout>
  );
}
```

---

## Design Tokens (from intent)

```typescript
@style({
  variant: 'primary',
  size: 'lg', 
  rounded: true,
  elevation: 'md'
})
```

Resolves to:

```css
.component {
  background-color: var(--color-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```
