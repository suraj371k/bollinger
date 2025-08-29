# 🚀 Bollinger Bands Pro - Advanced Trading Chart

A **professional-grade** Bollinger Bands trading chart built with Next.js, TypeScript, and KLineCharts. This project demonstrates advanced financial data visualization with real-time indicator calculations and a stunning modern UI.

![Bollinger Bands Pro](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 **Professional Trading Interface**
- **Real-time Bollinger Bands calculation** with customizable parameters
- **Interactive candlestick charts** with professional styling
- **Live data simulation** with realistic price movements
- **Responsive design** optimized for all screen sizes

### 📊 **Advanced Technical Analysis**
- **Custom Bollinger Bands indicator** implementation
- **Configurable parameters**: Length, Standard Deviation, Offset
- **Visual customization**: Colors, line styles, opacity, visibility
- **Real-time indicator updates** as parameters change

### 🎨 **Modern UI/UX Design**
- **Dark theme** with gradient backgrounds and glassmorphism effects
- **Animated loading states** and smooth transitions
- **Professional header** with live status indicators
- **Intuitive settings modal** with tabbed interface
- **Information panel** showing current indicator values

### 🔧 **Technical Excellence**
- **TypeScript** for type safety and better development experience
- **Custom indicator registration** with KLineCharts
- **Optimized performance** with React hooks and efficient re-renders
- **Modular architecture** with clean separation of concerns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd bollinger

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Chart.tsx          # Main chart component
│   └── BollingerSetting.tsx # Settings modal
└── lib/                   # Utility libraries
    ├── bollinger.ts       # Bollinger Bands logic
    ├── generateData.ts    # Data generation
    └── types.ts           # TypeScript definitions
```

## 🎛️ Configuration

### Bollinger Bands Parameters

The application allows customization of all Bollinger Bands parameters:

- **Length**: Period for Simple Moving Average (default: 20)
- **Standard Deviation**: Multiplier for band width (default: 2)
- **Offset**: Time offset for calculations (default: 0)

### Visual Customization

Each band can be customized independently:
- **Visibility**: Show/hide individual bands
- **Color**: Custom colors for each band
- **Width**: Line thickness (1-3px)
- **Style**: Solid or dashed lines
- **Fill Opacity**: Background fill transparency

## 🔬 Technical Implementation

### Custom Indicator Registration

The project implements a custom Bollinger Bands indicator using KLineCharts' indicator API:

```typescript
export function registerBollingerIndicator() {
  const bollinger = {
    name: 'CustomBOLL',
    calc: (dataList: KLineData[], indicator: Indicator) => {
      // Custom calculation logic
      const [length, multiplier, offset] = indicator.calcParams[0];
      // ... SMA and Standard Deviation calculations
    }
  };
  registerIndicator(bollinger);
}
```

### Real-time Data Generation

Simulates realistic market data with trend and volatility components:

```typescript
export function generateOHLCV(): OHLCV[] {
  // Generates 300 data points with realistic price movements
  // Includes trend and volatility for better Bollinger Bands demonstration
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradients (#3B82F6 to #1D4ED8)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)
- **Background**: Dark slate gradients

### Typography
- **Headers**: Bold, white text with blue accents
- **Body**: Medium weight, slate colors
- **Labels**: Small, muted colors

## 🚀 Performance Optimizations

- **Efficient re-renders** using React hooks
- **Memoized calculations** for Bollinger Bands
- **Optimized chart updates** with proper dependency arrays
- **Lazy loading** of chart components

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Tailwind CSS** for styling

## 📈 Future Enhancements

- [ ] **Real-time data feeds** from financial APIs
- [ ] **Multiple timeframe support**
- [ ] **Additional technical indicators**
- [ ] **Trading signals and alerts**
- [ ] **Portfolio management features**
- [ ] **Backtesting capabilities**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **KLineCharts** for the excellent charting library
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **TypeScript** team for the type-safe JavaScript

---

**Built with ❤️ for the trading community**

*This project demonstrates advanced React/TypeScript skills and professional UI/UX design principles. Perfect for showcasing technical expertise in financial technology applications.*
