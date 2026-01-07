# Search Parameters Object Examples

This document shows examples of what the search parameters object looks like when returned from the `onSearch` callback.

## Basic Example

When a user fills out the search form and clicks "Search", the `onSearch` callback receives an object like this:

```typescript
{
  productName: "iPhone 15",
  category: "electronics",
  specificPrices: ["100", "101", "102", ..., "150", "178", "190"],
  inStock: true,
  condition: "new",
  shippingFrom: ["us", "ca", "uk"],
  dateAdded: "2024-01-15",
  brand: "apple",
  freeShipping: true,
  rating: "4",
  keywords: ["wireless", "bluetooth", "fast"],
  productIds: ["1", "2", "3", "4", "5", "10", "15", "16", "17", "18", "19", "20"]
}
```

## Field Type Examples

### Text Field
```typescript
{
  productName: "iPhone 15"  // String value
}
```

### Number Field
```typescript
{
  priceMin: "100",  // String representation of number
  priceMax: "500"
}
```

### Dropdown (Single Select)
```typescript
{
  category: "electronics",  // Selected value
  brand: "apple"
}
```

### Multi-Select Dropdown
```typescript
{
  shippingFrom: ["us", "ca", "uk"],  // Array of selected values
  tags: ["featured", "bestseller"]
}
```

### Checkbox
```typescript
{
  inStock: true,        // Boolean
  freeShipping: false
}
```

### Radio Buttons
```typescript
{
  condition: "new"  // Single selected value
}
```

### Date Field
```typescript
{
  dateAdded: "2024-01-15"  // ISO date string (YYYY-MM-DD)
}
```

### Pill Field (Text)
```typescript
{
  keywords: ["wireless", "bluetooth", "fast"]  // Array of strings
}
```

### Pill Field (Number with Ranges)
```typescript
// User typed: "100-150, 178, 190"
{
  specificPrices: [
    "100", "101", "102", "103", ..., "149", "150",  // Expanded range 100-150
    "178",                                            // Individual value
    "190"                                             // Individual value
  ]
}

// User typed: "1-5, 10, 15-20"
{
  productIds: [
    "1", "2", "3", "4", "5",        // Range 1-5
    "10",                            // Individual
    "15", "16", "17", "18", "19", "20"  // Range 15-20
  ]
}
```

## Empty/Default Values

When fields are not filled or are at their default state:

```typescript
{
  productName: "",           // Empty string for text
  category: "",              // Empty string for dropdown
  specificPrices: [],        // Empty array for pill fields
  shippingFrom: [],          // Empty array for multiselect
  inStock: false,            // False for unchecked checkbox
  condition: "",             // Empty string for unselected radio
  dateAdded: ""              // Empty string for date
}
```

## Complete Real-World Example

```typescript
// User searching for wireless earbuds under $200
const searchParams = {
  productName: "wireless earbuds",
  category: "electronics",
  specificPrices: ["50", "51", ..., "200"],  // Range: 50-200
  inStock: true,
  condition: "new",
  shippingFrom: ["us"],
  dateAdded: "2024-01-01",
  brand: "apple",
  freeShipping: true,
  rating: "4",
  keywords: ["wireless", "bluetooth", "noise-canceling"],
  productIds: []  // Not searching by IDs
};
```

## Using Search Params in Your Backend

### REST API Example

```typescript
const handleSearch = async (params: Record<string, any>) => {
  // Build query string
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      // For arrays, join with comma or send multiple params
      queryParams.append(key, value.join(','));
    } else if (value !== '' && value !== false && value !== null) {
      // Only include non-empty values
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(`/api/products?${queryParams.toString()}`);
  const results = await response.json();

  setSearchResults(results);
};
```

### GraphQL Example

```typescript
const handleSearch = async (params: Record<string, any>) => {
  const query = `
    query SearchProducts($filters: ProductFilters!) {
      products(filters: $filters) {
        id
        name
        price
        category
      }
    }
  `;

  const variables = {
    filters: {
      name: params.productName,
      category: params.category,
      priceRange: params.specificPrices,
      inStock: params.inStock,
      shippingCountries: params.shippingFrom,
      keywords: params.keywords
    }
  };

  const response = await graphqlClient.query({ query, variables });
  setSearchResults(response.data.products);
};
```

### Database Query Example (Prisma)

```typescript
const handleSearch = async (params: Record<string, any>) => {
  const where: any = {};

  // Text search
  if (params.productName) {
    where.name = { contains: params.productName, mode: 'insensitive' };
  }

  // Exact match
  if (params.category) {
    where.category = params.category;
  }

  // Array contains
  if (params.keywords?.length > 0) {
    where.keywords = { hasSome: params.keywords };
  }

  // Number range
  if (params.specificPrices?.length > 0) {
    where.price = {
      in: params.specificPrices.map(Number)
    };
  }

  // Boolean
  if (params.inStock) {
    where.inStock = true;
  }

  // Date range
  if (params.dateAdded) {
    where.createdAt = { gte: new Date(params.dateAdded) };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  return products;
};
```

## Filtering Out Empty Values

Often you want to filter out empty values before sending to API:

```typescript
const handleSearch = (params: Record<string, any>) => {
  // Remove empty values
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    // Keep if:
    // - Array with items
    // - Non-empty string
    // - True boolean
    if (
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === 'string' && value.trim() !== '') ||
      (typeof value === 'boolean' && value === true)
    ) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  console.log('Clean params:', cleanParams);
  // Send to API
  searchAPI(cleanParams);
};
```

## TypeScript Type Definition

Define a type for your search params:

```typescript
interface ProductSearchParams {
  productName?: string;
  category?: string;
  specificPrices?: string[];
  inStock?: boolean;
  condition?: 'new' | 'used' | 'refurbished';
  shippingFrom?: string[];
  dateAdded?: string;
  brand?: string;
  freeShipping?: boolean;
  rating?: string;
  keywords?: string[];
  productIds?: string[];
}

const handleSearch = (params: ProductSearchParams) => {
  // Type-safe search handling
};
```
