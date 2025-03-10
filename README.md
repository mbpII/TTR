# Estimated Time To Read (TTR)

Welcome to the web application of the **Time To Read (TTR)** project.

I have another project similar to this one—a Chrome extension accessible via GitHub. However, to make a browser extension compatible with all browsers and mobile devices with proprietary engines would require an inordinate amount of development time. Rather than recoding this functionality for various platforms, I decided to create this experience via the web for greater accessibility.

Right now, you can access **Estimated Time To Read** via your browser or `curl`. A full website is forthcoming; in the meantime, you can use `curl` for your output or simply paste the link in your browser.

---

## Usage

You can estimate reading time for any publicly accessible webpage using either the **production deployment** or the **local development version**.

### **Production (Live API)**

```bash
curl https://api-timetoread.up.railway.app/https://www.newyorker.com/magazine/2025/03/03/the-white-lotus-tv-review-hbo
curl https://api-timetoread.up.railway.app/https://www.wired.com/story/openai-gpt-45/#intcid=_wired-verso-hp-trending_72eddac3-c12b-482b-8ce4-3eeaafa28ef8_popular4-2
curl https://api-timetoread.up.railway.app/https://www.theverge.com/favorites/621864/skype-microsoft-goodbye
```

### **Local Development**

If you're running the app locally, use the following commands:

```bash
curl http://localhost:3000/https://www.newyorker.com/magazine/2025/03/03/the-white-lotus-tv-review-hbo
curl http://localhost:3000/https://www.wired.com/story/openai-gpt-45/#intcid=_wired-verso-hp-trending_72eddac3-c12b-482b-8ce4-3eeaafa28ef8_popular4-2
curl http://localhost:3000/https://www.theverge.com/favorites/621864/skype-microsoft-goodbye
```

**Note:** This service does not bypass paywalls.

---

## Example Output

```json
{
  "url": "http://newyorker.com/article",
  "wordCount": 1000,
  "readingModes": {
    "standard": {
      "minutes": 5,
      "comprehension": "High"
    },
    "speedreading": {
      "minutes": 4,
      "comprehension": "Moderate"
    },
    "skimming": {
      "minutes": 2,
      "comprehension": "Low"
    }
  }
}
```

---

## Features

- **Universal Access**: Works on any device with internet connectivity
- **Multiple Reading Modes**: Estimates for standard reading, speed reading, and skimming
- **Comprehension Insights**: Each reading mode includes expected comprehension level
- **Simple Interface**: Easy to use with `curl` or directly in your browser

---

## Deployment

The service is available in two environments:

1. **Production (Live API)**:
   Access the live API at:
   ```
   https://api-timetoread.up.railway.app/<url>
   ```
   Replace `<url>` with the webpage URL you want to analyze.

   Example:
   ```bash
   curl https://api-timetoread.up.railway.app/https://example.com
   ```

2. **Local Development**:
   If you're running the app locally, access it at:
   ```
   http://localhost:3000/<url>
   ```
   Replace `<url>` with the webpage URL you want to analyze.

   Example:
   ```bash
   curl http://localhost:3000/https://example.com
   ```

---

## How It Works

TTR analyzes the content of webpages to calculate estimated reading times based on word count and different reading speeds:

- **Standard Reading**: 200 words per minute with high comprehension
- **Speed Reading**: 300 words per minute with moderate comprehension
- **Skimming**: 500 words per minute with low comprehension

---

## Future Plans

- Full web interface with additional features
- Support for multiple links at once with incremental reading times
- Potential integration of LLM-based summarization
- Routing to specific reading modes
