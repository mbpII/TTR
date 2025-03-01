// Import the serve function from the Bun framework
import { serve } from "bun";

// Define the possible reading modes and comprehension levels as type unions
type ReadingMode = "standard" | "speedreading" | "skimming";
type ComprehensionLevel = "High" | "Moderate" | "Low";

// Interface defining the payload structure for reading mode responses
interface ReadingModePayload {
  minutes: number;
  comprehensionLevel: string;
}

// Interface defining the complete API response structure
interface ReadingTimeResponse {
  url: string;
  wordCount: number;
  readingModes: {
    [Mode in ReadingMode]: ReadingModePayload;
  };
}

// Interface for error response structure
interface ErrorResponse {
  error: string;
}

// Abstract base class implementing the Strategy pattern for different reading modes
abstract class TimeToReadStrategy {
  protected abstract readingSpeed: number;
  protected abstract comprehensionLevel: ComprehensionLevel;
  protected abstract mode: ReadingMode;

  // Calculate reading time based on word count and reading speed
  public calculateReadingTime(wordCount: number): number {
    return Math.ceil(wordCount / this.readingSpeed);
  }

  // Get complete reading time payload including comprehension level
  public getReadingTime(wordCount: number): ReadingModePayload {
    return {
      minutes: this.calculateReadingTime(wordCount),
      comprehensionLevel: this.mode,
    };
  }

  // Getter for reading mode
  public getMode(): ReadingMode {
    return this.mode;
  }
}

// Concrete strategy class for skimming reading mode
class SkimmingERT extends TimeToReadStrategy {
  protected readingSpeed = 500;
  protected comprehensionLevel: ComprehensionLevel = "Low";
  protected mode: ReadingMode = "skimming";
}

// Concrete strategy class for speed reading mode
class SpeedReadingERT extends TimeToReadStrategy {
  protected readingSpeed = 441;
  protected comprehensionLevel: ComprehensionLevel = "Low";
  protected mode: ReadingMode = "speedreading";
}

// Concrete strategy class for standard reading mode
class StandardERT extends TimeToReadStrategy {
  protected readingSpeed = 238;
  protected comprehensionLevel: ComprehensionLevel = "Low";
  protected mode: ReadingMode = "standard";
}

// Create and configure the HTTP server
serve({
  port: 3000,
  async fetch(request: Request): Promise<Response> {
    // Extract URL from request
    const url = new URL(request.url);

    // Get website from URL path and validate
    let websiteInput: string = url.pathname.slice(1);
    if (!websiteInput || websiteInput.trim() === "") {
      const errorResponse: ErrorResponse = {
        error: "Missing website in URL.",
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Add http:// prefix if missing
    if (!/^https?:\/\//i.test(websiteInput)) {
      websiteInput = "http://" + websiteInput;
    }

    // Validate URL format
    let websiteUrl: URL;
    try {
      websiteUrl = new URL(websiteInput);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: "Invalid URL provided.",
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      // Fetch and process website content
      const res = await fetch(websiteUrl.href);
      console.log(websiteUrl.href);
      console.log(websiteUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${res.statusText}`);
      }
      const html = await res.text();

      // Extract text content and count words
      const textContent: string = html.replace(/<[^>]+>/g, " ");
      const words: string[] = textContent.trim().split(/\s+/).filter(Boolean);
      const wordCount: number = words.length;

      // Initialize reading strategies
      const strategies: TimeToReadStrategy[] = [
        new SkimmingERT(),
        new SpeedReadingERT(),
        new StandardERT(),
      ];
      const readingModes = {} as {
        [Mode in ReadingMode]: ReadingModePayload;
      };

      // Calculate reading times for each strategy
      strategies.forEach((strategy) => {
        readingModes[strategy.getMode()] = strategy.getReadingTime(wordCount);
      });

      // Prepare and send response
      const responseData: ReadingTimeResponse = {
        url: websiteUrl.href,
        wordCount,
        readingModes,
      };

      return new Response(JSON.stringify(responseData), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: unknown) {
      // Handle errors and return appropriate response
      const message =
        error instanceof Error ? error.message : "Unknown error occurred.";
      const errorResponse: ErrorResponse = { error: message };
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
