export function convertToBold(text: string) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <>
            {parts.map((part, i) => 
                part.startsWith('**') && part.endsWith('**') 
                    ? <strong key={i}>{part.slice(2, -2)}</strong>
                    : part
            )}
        </>
    );
}

export const parseHtmlToLinkObject = (htmlString: string) => {
    // Regular expressions to extract href and text content
    const linkRegex = /<a\s+href=['"](.*?)['"][^>]*>(.*?)<\/a>/;
    const match = htmlString.match(linkRegex);
    
    if (match) {
      const [_, href, text] = match;
      return {
        text: href.trim(),
        link: href,
        color: 'blue',
        decoration: 'underline' as const // Type assertion to satisfy pdfMake types
      };
    }
    
    // Return plain text if no link is found
    return { text: htmlString.replace(/<[^>]*>/g, '').trim() };
};

export const parseHtmlToLinkObjectWithLabel = (htmlString: string) => {
    // Regular expressions to extract href and text content
    const linkRegex = /<a\s+href=['"](.*?)['"][^>]*>(.*?)<\/a>/;
    const match = htmlString.match(linkRegex);
    
    if (match) {
      const [_, href, text] = match;
      return {
        text: text.trim(),
        link: href,
        color: 'blue',
        decoration: 'underline' as const // Type assertion to satisfy pdfMake types
      };
    }
    
    // Return plain text if no link is found
    return { text: htmlString.replace(/<[^>]*>/g, '').trim() };
};

export const extractLabelFromHtmlAnchor = (htmlString: string) => {
    const linkRegex = /<a\s+href=['"](.*?)['"][^>]*>(.*?)<\/a>/;
    const match = htmlString.match(linkRegex);

    if (match) {
        const [_, href, text] = match;
        return {
          text: text.trim(),
        };
    }
    // Return plain text if no link is found
    return { text: htmlString.replace(/<[^>]*>/g, '').trim() };
}