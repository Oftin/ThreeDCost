export interface MaterialProfile {
  id: string;
  name: string;
  costPerGram: number;
  density: number; // g/cm^3
  energyConsumption: number; // kWh/gram
}
