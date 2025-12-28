import { toast } from "sonner";

// Shopify API Configuration
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'nnbp6n-4x.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
// Storefront tokens are designed for client-side use with read-only product access
const SHOPIFY_STOREFRONT_TOKEN = 'c6985cc2e8eb413426a972bac7e4a101';

// Input validation helpers
const MAX_PRODUCTS_LIMIT = 100;
// Updated pattern to support Arabic characters and URL-encoded handles
const PRODUCT_HANDLE_PATTERN = /^[\u0600-\u06FFa-z0-9\-]+$/;
const ALLOWED_QUERY_CHARS = /^[\u0600-\u06FFa-zA-Z0-9\s:*_-]+$/;

function validateFirstParam(first: number): number {
  if (typeof first !== 'number' || first < 1) return 1;
  if (first > MAX_PRODUCTS_LIMIT) return MAX_PRODUCTS_LIMIT;
  return first;
}

function validateProductHandle(handle: string): string | null {
  if (!handle || typeof handle !== 'string') return null;
  // Decode URL-encoded handles first
  const decoded = decodeURIComponent(handle.trim());
  const trimmed = decoded.toLowerCase();
  // Support Arabic characters and standard handle characters
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

export interface ShopifyMetafield {
  key: string;
  value: string;
  type: string;
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
    metafields?: Array<ShopifyMetafield | null>;
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

  if (response.status === 401) {
    toast.error("Shopify: Storefront API not enabled", {
      description: "Please enable Storefront API access in your Shopify admin settings under Apps > Develop apps.",
    });
    return null;
  }

  if (!response.ok) {
    throw new Error('Unable to connect to store');
  }

  const data = await response.json();
  
  if (data.errors) {
    // Check for unauthorized errors in the response
    const hasUnauthorized = data.errors.some((e: { extensions?: { code?: string } }) => 
      e.extensions?.code === 'UNAUTHORIZED'
    );
    if (hasUnauthorized) {
      toast.error("Shopify: Access denied", {
        description: "Storefront API access token may be invalid. Please check your Shopify app settings.",
      });
      return null;
    }
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

export interface ShopifyCollection {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: {
      url: string;
      altText: string | null;
    } | null;
    products: {
      edges: ShopifyProduct[];
    };
  };
}

const STOREFRONT_COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          products(first: 50) {
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
      ingredients_ar: metafield(namespace: "custom", key: "ingredients_ar") {
        key
        value
        type
      }
      ingredients_en: metafield(namespace: "custom", key: "ingredients_en") {
        key
        value
        type
      }
      usage_instructions_ar: metafield(namespace: "custom", key: "usage_instructions_ar") {
        key
        value
        type
      }
      usage_instructions_en: metafield(namespace: "custom", key: "usage_instructions_en") {
        key
        value
        type
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

export async function fetchShopifyCollections(first: number = 20): Promise<ShopifyCollection[]> {
  try {
    const validatedFirst = validateFirstParam(first);
    
    const data = await storefrontApiRequest(STOREFRONT_COLLECTIONS_QUERY, { 
      first: validatedFirst
    });
    if (!data) return [];
    return data.data.collections.edges || [];
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
    
    const product = data.data.productByHandle;
    if (!product) return null;
    
    // Convert individual metafield properties to array format
    const metafields: Array<ShopifyMetafield | null> = [
      product.ingredients_ar,
      product.ingredients_en,
      product.usage_instructions_ar,
      product.usage_instructions_en
    ];
    
    // Return product with metafields array
    return {
      ...product,
      metafields
    };
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
