import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { FlowDataAttributes } from "../internal/props.js";

export type EmailTemplateLayoutVariant =
  | "base"
  | "transactional"
  | "operational-summary"
  | "security-alert"
  | "team-invite"
  | "welcome";

export type EmailTemplateLayoutState =
  | "default"
  | "draft"
  | "ready"
  | "sent"
  | "error";

export type EmailTemplateLayoutDensity = "sm" | "md" | "lg";
export type EmailTemplateLayoutTone = "accent" | "neutral" | "success" | "warning" | "danger";

export interface EmailTemplateAction {
  label: string;
  href?: string;
  tone?: Extract<EmailTemplateLayoutTone, "accent" | "danger">;
}

export interface EmailTemplateRow {
  key?: string;
  label: string;
  value: string;
  mono?: boolean;
  strong?: boolean;
}

export interface EmailTemplateMetric {
  key?: string;
  label: string;
  value: string;
  delta?: string;
  tone?: EmailTemplateLayoutTone;
}

export interface EmailTemplateAlert {
  key?: string;
  label: string;
}

export interface EmailTemplateStep {
  key?: string;
  label: string;
}

export interface EmailTemplateLayoutProps extends FlowDataAttributes {
  variant?: EmailTemplateLayoutVariant;
  density?: EmailTemplateLayoutDensity;
  state?: EmailTemplateLayoutState;
  lang?: string;
  brand?: string;
  title?: string;
  preheader?: string;
  eyebrow?: string;
  headline?: string;
  body?: string;
  tone?: EmailTemplateLayoutTone;
  action?: EmailTemplateAction;
  rows?: EmailTemplateRow[];
  metrics?: EmailTemplateMetric[];
  alertsTitle?: string;
  alerts?: Array<EmailTemplateAlert | string>;
  code?: string;
  codeHelper?: string;
  steps?: Array<EmailTemplateStep | string>;
  note?: string;
  footer?: string;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface EmailTemplateLayoutComponent extends ForwardRefExoticComponent<EmailTemplateLayoutProps & RefAttributes<HTMLHtmlElement>> {
  displayName: "EmailTemplateLayout";
}

export const EmailTemplateLayout: EmailTemplateLayoutComponent;
