# Flexora Frontend - Command Reference

## Package Management

### Install Dependencies

```bash
pnpm install
```

### Add New Package

```bash
pnpm add <package-name>              # Production dependency
pnpm add -D <package-name>           # Dev dependency
```

### Remove Package

```bash
pnpm remove <package-name>
```

### Update Dependencies

```bash
pnpm update                          # Update all
pnpm update <package-name>           # Update specific
```

## Development Commands

### Start Development Server

```bash
pnpm dev
```

Opens at: http://localhost:5173

### Build for Production

```bash
pnpm build
```

Output: `dist/` folder

### Preview Production Build

```bash
pnpm preview
```

### Lint Code

```bash
pnpm run lint                        # Check for issues
pnpm run lint -- --fix               # Auto-fix issues
```

## Common Development Tasks

### Create New Component

```bash
# Create file
touch src/components/MyComponent.jsx

# Component template
import React from 'react';

const MyComponent = () => {
  return (
    <div className="p-4">
      {/* Your component code */}
    </div>
  );
};

export default MyComponent;
```

### Create New Page

```bash
# Create file
touch src/pages/MyPage.jsx

# Add route in App.jsx
<Route path="/my-page" element={<MyPage />} />
```

### Add New Store

```bash
# Create file
touch src/store/myStore.js

# Store template
import { create } from 'zustand';

const useMyStore = create((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));

export default useMyStore;
```

## Tailwind CSS Commands

### Generate Tailwind Config

```bash
pnpm exec tailwindcss init -p
```

### View Tailwind Classes (in project)

Use Tailwind IntelliSense VS Code extension

## Git Commands (if using Git)

### Initial Commit

```bash
git add .
git commit -m "feat: initial frontend setup with React, Tailwind, and routing"
```

### Feature Branch

```bash
git checkout -b feature/dashboard
git add .
git commit -m "feat: implement dashboard with stats"
git push origin feature/dashboard
```

## Useful NPM Scripts (add to package.json)

```json
{
	"scripts": {
		"dev": "vite",
		"build": "vite build",
		"preview": "vite preview",
		"lint": "eslint . --ext js,jsx",
		"lint:fix": "eslint . --ext js,jsx --fix",
		"format": "prettier --write \"src/**/*.{js,jsx,json,css,md}\"",
		"type-check": "tsc --noEmit",
		"clean": "rm -rf dist node_modules .vite",
		"reinstall": "pnpm clean && pnpm install"
	}
}
```

## Testing Backend Connection

### Test API Endpoint

```bash
# From project root
curl http://localhost:8080/api/user/me -b "connect.sid=YOUR_COOKIE"
```

### Check Backend Status

```bash
curl http://localhost:8080/health
# or
curl http://localhost:8080/
```

## Debugging

### Clear Vite Cache

```bash
rm -rf node_modules/.vite
pnpm dev
```

### Clear All Caches

```bash
rm -rf node_modules/.vite dist .cache
pnpm dev
```

### Reset Everything

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

## Environment Variables

### Create .env file

```bash
touch .env
```

### Add variables

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Flexora
```

### Access in code

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Docker Commands (if containerizing)

### Create Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

### Build and Run

```bash
docker build -t flexora-frontend .
docker run -p 5173:5173 flexora-frontend
```

## Useful VS Code Extensions

```bash
# Install these extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- GitLens
```

## Common Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
pnpm dev -- --port 3000
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Tailwind Classes Not Working

```bash
# Check PostCSS config
cat postcss.config.js

# Restart dev server
# Ctrl+C, then pnpm dev
```

### CORS Errors

```javascript
// Backend needs to allow frontend origin
// In backend: cors({ origin: 'http://localhost:5173', credentials: true })
```

## Performance Optimization

### Analyze Bundle Size

```bash
pnpm build
pnpm exec vite-bundle-visualizer
```

### Lazy Load Routes

```javascript
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));

<Suspense fallback={<div>Loading...</div>}>
	<Dashboard />
</Suspense>;
```

## Deployment

### Build for Production

```bash
pnpm build
# Output in dist/
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

---

**Quick Reference Card**

| Command             | Description              |
| ------------------- | ------------------------ |
| `pnpm dev`          | Start dev server         |
| `pnpm build`        | Build for production     |
| `pnpm preview`      | Preview production build |
| `pnpm add <pkg>`    | Install package          |
| `pnpm remove <pkg>` | Remove package           |
| `Ctrl+C`            | Stop dev server          |

**Current Setup:**

-   Dev Server: http://localhost:5173
-   Backend API: http://localhost:8080
-   Package Manager: pnpm
