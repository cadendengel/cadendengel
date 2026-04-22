# Caden Dengel - Portfolio Website

My personal portfolio website showcasing my web development projects, technical skills, and professional experience.

## Built With

- **React** - Frontend framework
- **Vite** - Build tool and dev server
- **CSS** - Custom styling with CSS variables for theming
- **JavaScript** - Modern JavaScript features

## Features

- Dark/Light theme toggle with localStorage persistence
- Responsive design
- Lazy loading
- SEO-optimized with meta tags and Open Graph
- Professional project showcase
- Skills section with categorized technical abilities

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
client/
├── public/
│   └── img/           # Images and static assets
├── src/
│   ├── App.jsx        # Main application component
│   ├── App.css        # Component-specific styles
│   ├── index.css      # Global styles and theme variables
│   └── main.jsx       # Application entry point
├── index.html         # HTML template
└── package.json       # Dependencies and scripts
```

## Deployment

This site can be deployed to any static hosting service:

- Vercel
- Netlify
- Firebase Hosting
- AWS S3 + CloudFront
- GitHub Pages

### Counter API Proxy Requirement

Traffic counters are requested from `/api/counter/...` on the same origin to avoid browser CORS errors.

- Development is already handled by Vite proxy in `vite.config.js`.
- Production must configure a reverse proxy/edge function so `/api/counter/*` forwards to `https://api.counterapi.dev/*`.

#### AWS S3 Hosting

S3 static website hosting alone cannot proxy `/api/counter/*`.

- Put CloudFront in front of your S3 bucket.
- Add a behavior for path pattern `/api/counter/*`.
- Route that behavior to a backend that can proxy to `https://api.counterapi.dev/*` (for example API Gateway + Lambda, or a custom origin that performs the forward).
- Keep your site assets (`/*`) routed to the S3 origin.

#### Deploy Included Lambda Proxy (SAM)

This repo includes a Lambda proxy at `infrastructure/counter-proxy/index.mjs` and a SAM template at `infrastructure/counter-proxy/template.yaml`.

1. Install the AWS SAM CLI.
2. From repo root, build and deploy:

```bash
sam build -t infrastructure/counter-proxy/template.yaml
sam deploy \
	--stack-name cadendengel-counter-proxy \
	--resolve-s3 \
	--capabilities CAPABILITY_IAM \
	--parameter-overrides AllowedOrigin=https://cadendengel.com
```

3. After deploy, copy the `CounterProxyApiUrl` output.
4. In CloudFront:
	 - Add an origin pointing to your API Gateway domain (the host part of `CounterProxyApiUrl`).
	 - Add behavior `/api/counter/*` to that origin.
	 - Set viewer protocol policy to `Redirect HTTP to HTTPS`.
	 - Disable caching for this behavior (Managed-CachingDisabled recommended).

Once that is live, browser calls to `/api/counter/...` stay same-origin and no longer hit CORS blocks.

## Contact

Caden Dengel - caden.d.dengel@gmail.com

Portfolio: [cadendengel.com](https://cadendengel.com)

LinkedIn: [linkedin.com/in/cadendengel](https://linkedin.com/in/cadendengel)

GitHub: [github.com/cadendengel](https://github.com/cadendengel)

## License

© 2026 Caden Dengel. All Rights Reserved.

The code in this repository is available for viewing and reference purposes only. You may not copy, modify, distribute, or use this code for your own portfolio without explicit written permission. Feel free to learn from the code structure and techniques, but please create your own original work.
