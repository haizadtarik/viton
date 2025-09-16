
// This service connects to the backend virtual try-on API.

// Get the API URL from environment variable or use fallback
const API_URL = __SERVER_URL__;

// Helper to ensure we get clean base64 data
const getBase64Data = (dataUrl: string) => {
    if (dataUrl.startsWith('data:')) {
        return dataUrl.split(',')[1];
    }
    return dataUrl;
};

// Simple base64 signature-based mime detection
const detectMimeType = (b64: string): string => {
    const head = b64.substring(0, 10);
    if (head.startsWith('/9j/')) return 'image/jpeg'; // JPEG
    if (head.startsWith('iVBORw0KG')) return 'image/png'; // PNG
    if (head.startsWith('R0lGOD')) return 'image/gif'; // GIF
    if (head.startsWith('UklGR')) return 'image/webp'; // WebP
    return 'image/jpeg';
};

export const vitonApi = {
  generate: async (model_image_base64: string, garment_image_base64: string): Promise<string[]> => {
    console.log("Calling Viton API via proxy");

    const modelBase64 = getBase64Data(model_image_base64);
    const garmentBase64 = getBase64Data(garment_image_base64);

    console.log("Model image base64 length:", modelBase64.length);
    console.log("Garment image base64 length:", garmentBase64.length);
    console.log("Model base64 starts with:", modelBase64.substring(0, 50));
    console.log("Garment base64 starts with:", garmentBase64.substring(0, 50));

    const requestBody = {
        model_image_base64: modelBase64,
        garment_image_base64: garmentBase64,
        prompt: "",
        n_samples: 1,
        n_steps: 20,
        image_scale: 2,
        seed: -1
    };

    // Always use the proxy route to avoid CORS issues in all environments
    const url = '/api/viton';
    console.log("Using Viton endpoint:", url);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        const text = await response.text().catch(() => '');
        console.error('Unexpected non-JSON response from Viton endpoint:', { contentType, sample: text.slice(0, 200) });
        throw new Error('Unexpected response from server. Please try again.');
    }

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { error: `Request failed with status ${response.status}` };
        }
        console.error("API Error:", errorData);
        throw new Error(errorData.error || errorData.detail?.[0]?.msg || `Request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
        console.error("API returned a specific error:", result.error);
        throw new Error(result.error);
    }

    if (!result.images_base64 || result.images_base64.length === 0) {
        console.error("API returned no images in the response.");
        throw new Error("The API did not return any images.");
    }
    
    console.log("Viton API call successful, received images.");

    // The API returns raw base64 strings. We format them as data URLs
    // so they can be rendered in <img> tags.
    return result.images_base64.map((imgBase64: string) => {
      const mime = detectMimeType(imgBase64);
      return `data:${mime};base64,${imgBase64}`;
    });
  },
};
