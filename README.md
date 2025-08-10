# Customizable Website

This project is a customizable website built with React and TypeScript. It allows users to modify various components of the website, including the navigation header, footer, and simple forms, through an intuitive edit panel.

## Project Structure

```
customizable-website
├── src
│   ├── components
│   │   ├── Header.tsx        # Navigation header component
│   │   ├── Footer.tsx        # Footer component
│   │   ├── SimpleForm.tsx    # Simple form component
│   │   ├── EditPanel.tsx     # Edit panel for customization
│   │   └── Navigation.tsx     # Navigation links component
│   ├── data
│   │   └── components.json    # JSON structure for components
│   ├── App.tsx                # Main application component
│   ├── index.tsx              # Entry point of the application
│   └── types
│       └── index.ts           # TypeScript interfaces and types
├── public
│   └── index.html             # Main HTML file
├── package.json               # NPM configuration file
├── tsconfig.json              # TypeScript configuration file
└── README.md                  # Project documentation
```

## Features

1. **Customize Navigation Header**: Users can modify the navigation header with custom styles and links.
2. **Simple Forms**: Users can create and customize simple forms with various input fields.
3. **Footer**: A customizable footer that can display static or dynamic content.
4. **Edit Panel**: A right-side edit panel that allows users to customize components in real-time.

## JSON Response Structure

The project includes a JSON file (`src/data/components.json`) that defines the structure of the components, including their parent-child relationships, styles, API data, and static options for select components.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd customizable-website
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

## Usage

Once the application is running, users can interact with the edit panel to customize the website components. Changes will be reflected in real-time, allowing for a dynamic and interactive experience.

## License

This project is licensed under the MIT License.