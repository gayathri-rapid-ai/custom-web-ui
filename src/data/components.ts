import {
  ComponentName,
  ComponentRenderProps,
  LinkComponentDataProps,
  LinkComponentProps,
} from "../types";

const link1 = {
  name: "link",
  styles: {
    padding: "8px 16px",
    color: "#fff",
    background: "rgba(0,122,204,0.15)",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "1rem",
    transition: "background 0.2s",
    cursor: "pointer",
  },
  data: {
    label: "Home",
    url: "/home",
  },
  childs: [],
} as LinkComponentProps;
const link2 = {
  name: "link",
  styles: {
    padding: "8px 16px",
    color: "#fff",
    background: "rgba(0,122,204,0.15)",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "1rem",
    transition: "background 0.2s",
    cursor: "pointer",
  },
  data: {
    label: "Projects",
    url: "/projects",
  } as LinkComponentDataProps,
} as LinkComponentProps;

const childs = [
  {
    name: "header",
    styles: {
      padding: "24px 32px",
      color: "#fff",
      background: "linear-gradient(90deg, #007acc 0%, #005fa3 100%)",
      fontSize: "2rem",
      fontWeight: 700,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    childs: [
      {
        name: "navbar",
        styles: {
          background: "transparent",
          padding: "0",
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          alignItems: "center",
        },
        childs: [link1, link2],
      } as ComponentRenderProps,
    ],
  },
  {
    name: "main",
    styles: {
      padding: "32px",
      background: "#d5d5df",
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    }
  } as ComponentRenderProps,
  {
    name: "footer",
    styles: {
      padding: "16px 32px",
      backgroundColor: "#333",
      color: "#fff",
      textAlign: "center",
      fontSize: "0.875rem",
    },
    childs: [],
  }
];

export const test_data: ComponentRenderProps = {
  name: "page",
  styles: {},
  childs: childs,
} as ComponentRenderProps;

export default test_data;
