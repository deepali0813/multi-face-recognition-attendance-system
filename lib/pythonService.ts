// // Ye ek helper/utility function hai jiska sirf ek kaam hai — 
// // student ki photos ko Python face-recognition service ko 
// // bhejna aur wapas embedding (face ka numeric representation) lena.
import axios from "axios";

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL as string;
if (!PYTHON_SERVICE_URL) {
  throw new Error("PYTHON_SERVICE_URL is not defined");
}
interface EmbeddingSuccess {
  success: true;
  embedding: number[];
}

interface EmbeddingError {
  success: false;
  message: string;
}

export async function generateEmbedding(
  images: { buffer: Buffer; filename: string }[]
): Promise<EmbeddingSuccess | EmbeddingError> {
  try {
    const formData = new FormData();
    images.forEach((img) => {const uint8Array = new Uint8Array(img.buffer);

      formData.append("images", new Blob([uint8Array]), img.filename);
    });

    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/generate-embedding`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to connect to face recognition service",
    };
  }
}

// import axios from "axios";

// const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL as string;

// interface EmbeddingSuccess {
//   success: true;
//   embedding: number[];
// }

// interface EmbeddingError {
//   success: false;
//   message: string;
// }

// ==========================================
// TEMPORARY MOCK — Python service ready hote hi isse hata dena
// ==========================================
// export async function generateEmbedding(
//   images: { buffer: Buffer; filename: string }[]
// ): Promise<EmbeddingSuccess | EmbeddingError> {
//   console.log(`[MOCK] Pretending to generate embedding for ${images.length} image(s)`);

//   // thoda delay simulate karte hain, taaki real API jaisa lage
//   await new Promise((resolve) => setTimeout(resolve, 800));

//   // fake 128-length embedding array (random numbers)
//   const fakeEmbedding = Array.from({ length: 128 }, () => Math.random() * 2 - 1);

//   return {
//     success: true,
//     embedding: fakeEmbedding,
//   };
// }

// ==========================================
// REAL FUNCTION — Python ready hone pe upar wale mock ko delete karke
// iska comment hata dena
// ==========================================
/*
export async function generateEmbedding(
  images: { buffer: Buffer; filename: string }[]
): Promise<EmbeddingSuccess | EmbeddingError> {
  try {
    const formData = new FormData();
    images.forEach((img) => {
      const uint8Array = new Uint8Array(img.buffer);
      formData.append("images", new Blob([uint8Array]), img.filename);
    });

    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/generate-embedding`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to connect to face recognition service",
    };
  }
}
*/