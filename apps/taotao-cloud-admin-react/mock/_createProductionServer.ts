import { createProdMockServer } from 'vite-plugin-mock/client';

// @ts-ignore
const modules = import.meta.glob('./**/*.ts', { eager: true });

const mockModules: any[] = [];

Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) {
    return;
  }
  mockModules.push(...(modules[key] as any).default);
});

/**
 * Used in a production environment. Need to manually import all modules
 */
export function setupProdMockServer() {
  createProdMockServer(mockModules);
}