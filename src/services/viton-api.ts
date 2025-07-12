


// This service connects to the backend virtual try-on API.

// The backend is hosted on a different domain, so we use the full URL.
const API_URL = 'https://haizadtarik--vton-ootd-flux-vtonserver-fastapi-app.modal.run/viton';

// Helper to strip the data URL prefix (e.g., "data:image/jpeg;base64,")
// as the API likely expects raw base64 data.
const getBase64Data = (dataUrl: string) => {
    if (dataUrl.includes(',')) {
        return dataUrl.split(',')[1];
    }
    return dataUrl;
};

export const vitonApi = {
  generate: async (model_image_base64: string, garment_image_base64: string): Promise<string[]> => {
    console.log("Calling real Viton API at:", API_URL);

    const requestBody = {
        model_image_base64: getBase64Data(model_image_base64),
        garment_image_base64: getBase64Data(garment_image_base64),
    };

    console.log("Request body structure:", {
        model_image_length: requestBody.model_image_base64.length,
        garment_image_length: requestBody.garment_image_base64.length
    });

    // Create an AbortController for timeout handling
    const controller = new AbortController();
    
    // Set timeout to 7 minutes to give more time for the API
    const timeoutId = setTimeout(() => {
        console.log("Request is being aborted due to timeout");
        controller.abort();
    }, 7 * 60 * 1000); // 7 minutes in milliseconds

    // Add periodic status logging
    const statusInterval = setInterval(() => {
        console.log("API request still in progress...");
    }, 30000); // Log every 30 seconds

    try {
        console.log("Starting API request - this may take up to 5 minutes...");
        console.log("Request URL:", API_URL);
        console.log("Request method: POST");
        console.log("Content-Type: application/json");
        
        // Test if we can reach the API first
        console.log("Testing API connectivity...");
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': window.location.origin,
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
            mode: 'cors', // Explicitly set CORS mode
        });

        // Clear the timeout and status interval since we got a response
        clearTimeout(timeoutId);
        clearInterval(statusInterval);
        
        console.log("Response received!");
        console.log("Response status:", response.status);
        console.log("Response statusText:", response.statusText);
        console.log("Response ok:", response.ok);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            let errorData;
            try {
                const responseText = await response.text();
                console.log("Error response text:", responseText);
                try {
                    errorData = JSON.parse(responseText);
                } catch (parseError) {
                    errorData = { error: responseText || `Request failed with status ${response.status}` };
                }
            } catch (e) {
                errorData = { error: `Request failed with status ${response.status}` };
            }
            console.error("API Error:", errorData);
            throw new Error(errorData.error || errorData.detail?.[0]?.msg || `Request failed with status ${response.status}`);
        }

        const responseText = await response.text();
        console.log("Response text length:", responseText.length);
        console.log("Response text preview:", responseText.substring(0, 200) + "...");

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse response as JSON:", parseError);
            throw new Error("Invalid response format from API");
        }

        if (result.error) {
            console.error("API returned a specific error:", result.error);
            throw new Error(result.error);
        }

        if (!result.images_base64 || result.images_base64.length === 0) {
            console.error("API returned no images in the response. Full response:", result);
            throw new Error("The API did not return any images.");
        }
        
        console.log("Viton API call successful, received", result.images_base64.length, "images.");

        // The API returns raw base64 strings. We format them as data URLs
        // so they can be rendered in <img> tags.
        return result.images_base64.map((imgBase64: string) => `data:image/jpeg;base64,${imgBase64}`);
    } catch (error) {
        // Clear timeout and status interval in case of error
        clearTimeout(timeoutId);
        clearInterval(statusInterval);
        
        console.error("Detailed fetch error:", {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error: error
        });
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error("Request timed out after 7 minutes. The API might be experiencing heavy load or issues.");
            }
            if (error.message === 'Load failed') {
                throw new Error("Network connection failed. This could be due to:\n1. CORS policy blocking the request\n2. API server being down\n3. Network connectivity issues\n\nPlease check the browser console for more details.");
            }
            if (error.message.includes('CORS')) {
                throw new Error("CORS error: The API server needs to allow requests from this domain.");
            }
            if (error.message.includes('fetch')) {
                throw new Error("Network fetch failed. Please check your internet connection and try again.");
            }
        }
        
        throw error;
    }
  },
};
