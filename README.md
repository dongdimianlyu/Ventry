# Ventry

A Next.js application with Three.js integration.

## Getting Started

First, install the dependencies:

```bash
npm install --legacy-peer-deps
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Three.js Integration Notes

This project includes Three.js for 3D visualizations. When working with Three.js components:

1. Always use dynamic imports with `{ ssr: false }` for Three.js components
2. Add proper mounted state checks in Three.js components
3. Keep components simple and avoid complex Three.js features until basic rendering works

Example of proper Three.js component import:

```jsx
const ThreeComponent = dynamic(() => import('@/components/three/YourComponent'), {
  ssr: false,
  loading: () => <div>Loading 3D scene...</div>
});
```

## Deployment

The project is configured for deployment on Vercel:

1. Three.js dependencies are correctly configured in `package.json`
2. The Next.js configuration in `next.config.js` includes optimizations for Three.js
3. The middleware allows access to test pages

### Testing Deployment

Before deploying, you can verify the configuration works by visiting:

- `/api/health` - API health check endpoint
- `/deploy-test` - Simple page with no client-side dependencies
- `/minimal-3d` - Direct Three.js implementation

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
