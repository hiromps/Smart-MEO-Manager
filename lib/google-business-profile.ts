import { buildDemoBusinessProfileDataset, type DemoBusinessProfileDataset, type DemoInsightsPoint } from "./demo-data";

export interface GoogleBusinessProfileAdapter {
    getDemoDataset(namespace?: string): Promise<DemoBusinessProfileDataset>;
    getInsights(namespace?: string): Promise<DemoInsightsPoint[]>;
}

class MockGoogleBusinessProfileAdapter implements GoogleBusinessProfileAdapter {
    async getDemoDataset(namespace = "demo") {
        return buildDemoBusinessProfileDataset(namespace);
    }

    async getInsights(namespace = "demo") {
        return buildDemoBusinessProfileDataset(namespace).insights;
    }
}

const mockAdapter = new MockGoogleBusinessProfileAdapter();

export function getGoogleBusinessProfileAdapter(): GoogleBusinessProfileAdapter {
    return mockAdapter;
}