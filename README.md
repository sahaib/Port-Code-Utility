# Port Distance Calculator 🚢

A React-based utility for calculating nautical distances between ports using UN/LOCODE data and MapBox visualization.

## Features 🌟

- Search ports by UN/LOCODE or name
- Calculate nautical distances between ports
- Interactive map visualization using MapBox
- Country-based port filtering
- Real-time distance calculations
- Responsive design

## Prerequisites 📋

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm or yarn
- MapBox API key
- Internet connection (for UN/LOCODE data fetching)

## Installation 🛠️

1. Clone the repository:
```
git clone https://github.com/sahaib/Port-Code-Utility.git
```

```
cd Port-Code-Utility
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory:
```
VITE_MAPBOX_API_KEY=your_mapbox_api_key
```

4. Start the development server:
```
npm run dev
```

## Environment Variables 🔐

- `VITE_MAPBOX_TOKEN`: Your MapBox API token (Required for map visualization)

## Data Sources 📚

- **UN/LOCODE**: [UN/LOCODE Code List](https://unece.org/trade/cefact/unlocode-code-list-country-and-territory)
- **MapBox**: [MapBox GL JS](https://docs.mapbox.com/mapbox-gl-js/)

## Tech Stack 💻

- React + TypeScript
- Vite
- TailwindCSS
- MapBox GL JS
- Lucide Icons

## API Reference 📖

### UN/LOCODE Data Structure
```
interface PortData {
locode: string; // UN/LOCODE
name: string; // Port name
coordinates: string; // Format: "DDMMN DDDMME"
// ... other fields
}
```

### Distance Calculation
- Uses the Haversine formula for nautical distance calculations
- Coordinates are parsed from UN/LOCODE format (DDMMN DDDMME) to decimal degrees

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Credits 👏

- UN/LOCODE data: [UNECE](https://unece.org/)
- Mapping: [MapBox](https://www.mapbox.com/)
- Icons: [Lucide](https://lucide.dev/)

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 🆘

For support, email [hello@sahaibsingh.com] or open an issue in the repository.

---

Made with ❤️ by [Sahaib]
