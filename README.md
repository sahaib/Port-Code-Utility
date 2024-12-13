# Port Distance Calculator & UN/LOCODE Search Tool ⚓

A comprehensive React-based utility for maritime distance calculations, port lookups, and location-based port discovery using UN/LOCODE data.

## Features 🌟

- 🔍 Advanced port search by UN/LOCODE or name
- 📏 Multiple distance calculation modes:
  - Port-to-port distances
  - Unified distance calculator (ports and postal locations)
  - Bulk distance calculations via CSV
- 🗺️ Interactive map visualization with MapBox
- 📍 Nearby ports discovery
- 🌓 Dark/Light mode support
- 📱 Fully responsive design
- 🚀 Progressive Web App (PWA) support

## Prerequisites 📋

- Node.js (v18 or higher)
- npm or yarn
- MapBox API key
- Internet connection

## Installation 🛠️

1. Clone the repository:
```
git clone https://github.com/yourusername/port-distance-calculator.git
```

```
cd port-distance-calculator
```

2. Install dependencies:

```
npm install
```


3. Create a `.env` file:

```
VITE_MAPBOX_TOKEN=your_mapbox_token
```

4. Start development server:

```
npm run dev
```


## Environment Variables 🔐

Required environment variables:
- `VITE_MAPBOX_TOKEN`: MapBox API token for map visualization

## Scripts 📜

```
typescript:package.json
startLine: 6
endLine: 15
```


## Tech Stack 💻

- ⚛️ React 18 with TypeScript
- ⚡ Vite for blazing-fast builds
- 🎨 TailwindCSS with dark mode support
- 🗺️ MapBox GL JS for mapping
- 🎯 Lucide React for icons
- 📱 PWA support with Workbox
- 🔄 React Router v7 for navigation

## Project Structure 📁

```
src/
├── components/ # React components
├── config/ # Configuration files
├── hooks/ # Custom React hooks
├── services/ # API services
├── types/ # TypeScript types
├── utils/ # Utility functions
└── styles/ # Global styles and Tailwind config
```


## Features in Detail 🔍

### Port Lookup
- Search ports by UN/LOCODE or name
- Country-based filtering
- Detailed port information display

### Distance Calculators
- Standard port-to-port calculator
- Unified calculator (ports and postal locations)
- Bulk distance calculations with CSV support
- Interactive map visualization

### Nearby Ports Search
- Find ports within specified radius
- Map visualization of search results
- Distance and bearing calculations

## Development 🛠️

### CORS Handling
The application uses a dedicated proxy for handling CORS:

## Features in Detail 🔍

### Port Lookup
- Search ports by UN/LOCODE or name
- Country-based filtering
- Detailed port information display

### Distance Calculators
- Standard port-to-port calculator
- Unified calculator (ports and postal locations)
- Bulk distance calculations with CSV support
- Interactive map visualization

### Nearby Ports Search
- Find ports within specified radius
- Map visualization of search results
- Distance and bearing calculations

## Development 🛠️

### CORS Handling
The application uses a dedicated proxy for handling CORS:
```
typescript:src/config/constants.ts
startLine: 2
endLine: 4
```

### Building for Production
```
npm run build
```

This will:
1. Build the web application
2. Generate service worker
3. Create optimized assets
4. Generate PWA assets

## Contributing 🤝

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Credits 👏

- UN/LOCODE data: [UNECE](https://unece.org/)
- Mapping: [MapBox](https://www.mapbox.com/)
- Icons: [Lucide](https://lucide.dev/)

## License 📄

MIT License - See [LICENSE](LICENSE) file

## Support 🆘

For support:
- Open an issue in the repository
- Email: your.email@example.com

---

Made with ❤️ by [Sahaib]