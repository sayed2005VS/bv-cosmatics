import { toast } from "sonner";

// Shopify API Configuration
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'nnbp6n-4x.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
// Storefront tokens are designed for client-side use with read-only product access
const SHOPIFY_STOREFRONT_TOKEN = 'c6985cc2e8eb413426a972bac7e4a101';

// Input validation helpers
const MAX_PRODUCTS_LIMIT = 100;
const PRODUCT_HANDLE_PATTERN = /^[a-z0-9-]+$/;
const ALLOWED_QUERY_CHARS = /^[a-zA-Z0-9\s:*_-]+$/;

function validateFirstParam(first: number): number {
  if (typeof first !== 'number' || first < 1) return 1;
  if (first > MAX_PRODUCTS_LIMIT) return MAX_PRODUCTS_LIMIT;
  return first;
}

function validateProductHandle(handle: string): string | null {
  if (!handle || typeof handle !== 'string') return null;
  const trimmed = handle.trim().toLowerCase();
  if (!PRODUCT_HANDLE_PATTERN.test(trimmed)) return null;
  if (trimmed.length > 255) return null;
  return trimmed;
}

function sanitizeQueryString(query: string): string | null {
  if (!query || typeof query !== 'string') return null;
  const trimmed = query.trim();
  if (!ALLOWED_QUERY_CHARS.test(trimmed)) return null;
  if (trimmed.length > 500) return null;
  return trimmed;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          compareAtPrice: {
            amount: string;
            currencyCode: string;
          } | null;
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

// Storefront API helper function
export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Shopify API access requires an active Shopify billing plan. Your store needs to be upgraded to a paid plan.",
    });
    return null;
  }

  if (!response.ok) {
    throw new Error('Unable to connect to store');
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error('Unable to load store data');
  }

  return data;
}

// GraphQL Queries
const STOREFRONT_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const STOREFRONT_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// API Functions
export async function fetchShopifyProducts(first: number = 50, query?: string): Promise<ShopifyProduct[]> {
  try {
    const validatedFirst = validateFirstParam(first);
    const sanitizedQuery = query ? sanitizeQueryString(query) : undefined;
    
    const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { 
      first: validatedFirst, 
      query: sanitizedQuery 
    });
    if (!data) return [];
    return data.data.products.edges || [];
  } catch {
    return [];
  }
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct['node'] | null> {
  try {
    const validatedHandle = validateProductHandle(handle);
    if (!validatedHandle) {
      return null;
    }
    
    const data = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle: validatedHandle });
    if (!data) return null;
    return data.data.productByHandle;
  } catch {
    return null;
  }
}

export async function createStorefrontCheckout(items: Array<{ variantId: string; quantity: number }>): Promise<string> {
  const lines = items.map(item => ({
    quantity: Math.max(1, Math.min(item.quantity, 100)),
    merchandiseId: item.variantId,
  }));

  const cartData = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines },
  });

  if (!cartData) {
    throw new Error('Unable to create checkout');
  }

  if (cartData.data.cartCreate.userErrors.length > 0) {
    throw new Error('Unable to process your cart');
  }

  const cart = cartData.data.cartCreate.cart;
  
  if (!cart.checkoutUrl) {
    throw new Error('Checkout unavailable');
  }

  const url = new URL(cart.checkoutUrl);
  url.searchParams.set('channel', 'online_store');
  return url.toString();
}
