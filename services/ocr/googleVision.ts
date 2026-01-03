import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';

const API_KEY = Constants.expoConfig?.extra?.googleCloudVisionApiKey || process.env.EXPO_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY || '';

export interface OCRResult {
  text: string;
  confidence: number;
}

export async function recognizeTextFromImage(imageUri: string): Promise<OCRResult> {
  if (!API_KEY) {
    throw new Error('Google Cloud Vision API key is not configured. Please set EXPO_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY in your .env file.');
  }

  try {
    // Convert image to base64 for React Native
    let base64Image: string;
    
    if (imageUri.startsWith('file://') || imageUri.startsWith('content://')) {
      // Local file URI from camera - read using FileSystem
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      base64Image = base64;
    } else if (imageUri.startsWith('data:')) {
      // Data URI - extract base64
      base64Image = imageUri.split(',')[1];
    } else {
      // Remote URL - fetch and convert
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);
      base64Image = base64.replace(/^data:image\/\w+;base64,/, '');
    }

    // Call Google Cloud Vision API
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1,
                },
              ],
              imageContext: {
                languageHints: ['pa'], // Punjabi/Gurmukhi
              },
            },
          ],
        }),
      }
    );

    if (!visionResponse.ok) {
      const errorData = await visionResponse.json();
      throw new Error(`Google Vision API error: ${JSON.stringify(errorData)}`);
    }

    const data = await visionResponse.json();
    const textAnnotations = data.responses[0]?.textAnnotations;

    if (!textAnnotations || textAnnotations.length === 0) {
      return {
        text: '',
        confidence: 0,
      };
    }

    // First annotation contains the full text
    const fullText = textAnnotations[0].description;

    // Calculate average confidence from individual words
    const confidences = textAnnotations.slice(1).map((annotation: any) =>
      annotation.confidence || 0.5
    );
    const avgConfidence = confidences.length > 0
      ? confidences.reduce((a: number, b: number) => a + b, 0) / confidences.length
      : 0.5;

    return {
      text: fullText.trim(),
      confidence: avgConfidence,
    };
  } catch (error) {
    console.error('Error in Google Vision OCR:', error);
    throw error;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
