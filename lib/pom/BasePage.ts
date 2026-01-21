import { Page } from 'playwright';

export abstract class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string): Promise<void> {
        await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async close(): Promise<void> {
        await this.page.close();
    }
}
