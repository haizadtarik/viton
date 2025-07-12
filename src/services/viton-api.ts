
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
    console.log("Calling Viton API at:", API_URL);

    const requestBody = {
        model_image_base64: getBase64Data(model_image_base64),
        garment_image_base64: getBase64Data(garment_image_base64),
        n_samples: 1,
        n_steps: 20,
        image_scale: 2.0,
        seed: -1
    };

    console.log("Request body structure:", {
        model_image_length: requestBody.model_image_base64.length,
        garment_image_length: requestBody.garment_image_base64.length,
        n_samples: requestBody.n_samples,
        n_steps: requestBody.n_steps,
        image_scale: requestBody.image_scale,
        seed: requestBody.seed
    });

    // Create an AbortController for timeout handling
    const controller = new AbortController();
    
    // Set timeout to 5 minutes
    const timeoutId = setTimeout(() => {
        console.log("Request is being aborted due to timeout");
        controller.abort();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    try {
        console.log("Starting API request...");
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
        });

        // Clear the timeout since we got a response
        clearTimeout(timeoutId);
        
        console.log("Response received!");
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

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
            throw new Error(errorData.error || errorData.detail || `Request failed with status ${response.status}`);
        }

        const responseText = await response.text();
        console.log("Response text length:", responseText.length);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse response as JSON:", parseError);
            console.log("Raw response:", responseText);
            throw new Error("Invalid response format from API");
        }

        console.log("Parsed result:", result);

        if (result.error) {
            console.error("API returned an error:", result.error);
            throw new Error(result.error);
        }

        if (!result.images_base64 || result.images_base64.length === 0) {
            console.error("API returned no images. Full response:", result);
            throw new Error("The API did not return any images.");
        }
        
        console.log("API call successful, received", result.images_base64.length, "images.");

        // The API returns raw base64 strings. We format them as data URLs
        // so they can be rendered in <img> tags.
        return result.images_base64.map((imgBase64: string) => `data:image/jpeg;base64,${imgBase64}`);
    } catch (error) {
        // Clear timeout in case of error
        clearTimeout(timeoutId);
        
        console.error("Fetch error:", error);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error("Request timed out after 5 minutes. Please try again.");
            }
            if (error.message.includes('fetch')) {
                throw new Error("Network connection failed. Please check your internet connection and try again.");
            }
        }
        
        throw error;
    }
  },
};
