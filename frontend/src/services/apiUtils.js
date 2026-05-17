export const getHeaders = (apiKey) => ({
  'Content-Type': 'application/json',
  ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
});

export const buildAuthUrl = (url, appId, apiKey) => {
  if (appId && apiKey) {
    return `${url}?app_id=${appId}&app_key=${apiKey}`;
  }
  return url;
};

export const parseRSSFeed = (rssText) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(rssText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');
    const parsedItems = [];
    items.forEach(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const category = item.querySelector('category')?.textContent || '';
      parsedItems.push({ title, link, description, pubDate, category, source: 'RSS Feed' });
    });
    return parsedItems;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    return [];
  }
};

export const fetchFromApi = async (url, headers, context) => {
  try {
    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error in ${context}:`, error);
    throw error;
  }
};

export const fetchFromRSS = async (url, context) => {
  try {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const rssText = await response.text();
    return parseRSSFeed(rssText);
  } catch (error) {
    console.error(`Error in ${context}:`, error);
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
      return [];
    }
    throw error;
  }
};

export const stripHtml = (html) => {
  if (!html) return '';
  if (typeof html !== 'string') return String(html);
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
};
