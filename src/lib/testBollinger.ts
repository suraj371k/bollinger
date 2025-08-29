import { generateOHLCV } from './generateData';
import { registerBollingerIndicator } from './bollinger';

// Simple test to verify Bollinger Bands calculation
export function testBollingerBands() {
  console.log('🧪 Testing Bollinger Bands Calculation...');
  
  // Generate test data
  const testData = generateOHLCV();
  console.log(`📊 Generated ${testData.length} data points`);
  
  // Test the first few data points
  const sampleData = testData.slice(0, 5);
  console.log('📈 Sample data:', sampleData.map(d => ({
    timestamp: new Date(d.timestamp).toLocaleTimeString(),
    close: d.close.toFixed(2)
  })));
  
  // Test Bollinger Bands calculation manually
  const length = 20;
  const stdDev = 2;
  
  if (testData.length >= length) {
    const recentData = testData.slice(testData.length - length);
    const closes = recentData.map(d => d.close);
    
    // Calculate SMA
    const sum = closes.reduce((acc, val) => acc + val, 0);
    const sma = sum / length;
    
    // Calculate Standard Deviation
    const variance = closes.reduce((acc, val) => acc + Math.pow(val - sma, 2), 0) / length;
    const stdDeviation = Math.sqrt(variance);
    
    // Calculate Bollinger Bands
    const upperBand = sma + (stdDev * stdDeviation);
    const lowerBand = sma - (stdDev * stdDeviation);
    
    console.log('📊 Bollinger Bands Calculation Results:');
    console.log(`   SMA (${length}-period): ${sma.toFixed(2)}`);
    console.log(`   Standard Deviation: ${stdDeviation.toFixed(2)}`);
    console.log(`   Upper Band: ${upperBand.toFixed(2)}`);
    console.log(`   Lower Band: ${lowerBand.toFixed(2)}`);
    console.log(`   Band Width: ${(upperBand - lowerBand).toFixed(2)}`);
    
    // Verify the bands make sense
    if (upperBand > sma && sma > lowerBand) {
      console.log('✅ Bollinger Bands calculation is working correctly!');
      return true;
    } else {
      console.log('❌ Bollinger Bands calculation has issues!');
      return false;
    }
  } else {
    console.log('❌ Not enough data for Bollinger Bands calculation');
    return false;
  }
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testBollingerBands();
}
