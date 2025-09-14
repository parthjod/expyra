# **App Name**: Expyra Scan

## Core Features:

- Product Label Scanner: Use the device camera to scan product labels, extracting product name, batch ID, manufacturing date and expiry date using OCR and computer vision libraries (Tesseract.js and Tensorflow.js).
- Product Information Display: Display the extracted product information in a clear, structured format.
- Expiry Date Validation: Automatically validate the scanned expiry date against the current date, providing a visual indication of the product's status (e.g., 'Valid', 'Near Expiry', 'Expired').
- Inventory Alert Suggestions: Tool suggests actions to take based on real-time monitoring and AI. When an expiry date nears, suggest actions, such as applying a discount, mark for donation, or suggest removing stock.
- Simple Inventory Log: Store the extracted product details (name, batch ID, MFG date, EXP date) in a simple log in local storage. Each time app is refreshed log is updated to display all products and current state (valid, near expiry or expired)
- Dashboard overview: Simple list showing count of total products scanned, products near expiring, products available for donation and expired.

## Style Guidelines:

- Primary color: Vivid cyan (#00B8D4) to represent freshness and technological focus.
- Background color: Light cyan (#E0F7FA), providing a clean and unobtrusive backdrop.
- Accent color: Analogous blue (#0097A7), to add a cool, serious contrast and highlight important elements.
- Body and headline font: 'Inter' sans-serif, giving a modern, neutral, machined look suitable for body text and headlines.
- Use simple, line-based icons to represent product categories and actions.
- Employ a clean, grid-based layout to ensure a mobile-first, fully responsive design. Favor a minimalist aesthetic to highlight key information and actions.
- Incorporate subtle transitions and animations (e.g., when scanning a product or updating the status) to provide feedback and enhance the user experience.