import React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@design-system/react";
import "@design-system/components/styles.css";

createRoot(document.getElementById("root")).render(
  React.createElement(Button, {
    label: "Approve",
    variant: "primary",
    density: "md",
    icon: "check",
  }),
);
