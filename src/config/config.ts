export interface Config {
  baseUrl: string;
  apiUrl: string;
  timeout: {
    short: number;
    medium: number;
    long: number;
  };
  credentials: {
    defaultPassword: string;
  };
}

export const config: Config = {
  baseUrl: process.env.BASE_URL || 'https://parabank.parasoft.com',
  apiUrl: process.env.API_URL || 'https://parabank.parasoft.com/parabank/services_proxy/bank',
  timeout: {
    short: 5000,
    medium: 15000,
    long: 30000
  },
  credentials: {
    defaultPassword: process.env.DEFAULT_PASSWORD || 'Fabric!@#'
  }
}; 