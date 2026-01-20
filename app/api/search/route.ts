import { NextRequest, NextResponse } from 'next/server';
import { BrowserFactory } from '@/lib/pom/BrowserFactory';
import { ClothesSearchPage } from '@/lib/pom/ClothesSearchPage';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { query, type } = body;

        let searchQuery = query;

        if (type === 'image') {
            // In a real implementation, we would send the image to a Vision API
            // to identify the character.
            // For this demo, we'll simulate identification or use a fallback.
            console.log('Received image for search. Simulating analysis...');
            searchQuery = 'Anime Copslay Clothes'; // Fallback
        }

        if (!searchQuery) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const { browser, page } = await BrowserFactory.createPage();
        const searchPage = new ClothesSearchPage(page);

        // Perform search
        const results = await searchPage.search(searchQuery);

        await browser.close();

        return NextResponse.json({ results });

    } catch (error) {
        console.error('Search failed:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}
