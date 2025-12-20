# Custom Code Directory

⚠️ **WARNING: DO NOT MODIFY FILES IN THIS DIRECTORY** ⚠️

This folder contains custom code that should not be modified by AI.
Any code placed here is protected and maintained manually.

## Usage

- Place your custom scripts, integrations, or tracking code here
- Export functions/components from `index.ts`
- Import in your app using: `import { ... } from '@/custom'`

## Examples

```typescript
// Google Analytics
import { initAnalytics, trackEvent } from '@/custom';

// Facebook Pixel
import { initPixel, trackPixelEvent } from '@/custom';

// Custom integrations
import { myCustomFunction } from '@/custom';
```

## Adding New Code

1. Create your file in this directory (e.g., `analytics.ts`)
2. Export your functions/components from `index.ts`
3. Import and use in your app

## Protected Files

All files in this directory are protected from AI modification.
To change any code here, you must edit manually.
