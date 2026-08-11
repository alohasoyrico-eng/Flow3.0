import React, { forwardRef } from "react";

const brandColor = "#17171A";
const mutedColor = "#8A8781";
const secondaryColor = "#55534E";
const pageColor = "#F3F1ED";
const borderColor = "#E0DDD7";
const softBorderColor = "#EEEBE6";
const accentColor = "#FF3617";
const linkColor = "#E62D10";
const successColor = "#0E8A50";
const warningColor = "#B26A00";
const dangerColor = "#B42318";
const whiteColor = "#FFFFFF";
const fontStack = "Arial,Helvetica,sans-serif";
const monoStack = "Courier New,monospace";
const containerClass = "flow-" + "container";
const paddingClass = "flow-" + "px";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function toneColor(tone) {
  if (tone === "success") return successColor;
  if (tone === "warning") return warningColor;
  if (tone === "danger") return dangerColor;
  if (tone === "neutral") return mutedColor;
  return linkColor;
}

function resolveVariant(variant) {
  return variant ?? "base";
}

function text(value, fallback = "") {
  return value ?? fallback;
}

function Spacer({ size }) {
  return React.createElement("div", {
    style: { height: `${size}px`, lineHeight: `${size}px`, fontSize: "1px" },
  }, "\u00a0");
}

function ButtonLink({ action }) {
  if (!action?.label) return null;
  return React.createElement("table", {
    role: "presentation",
    cellPadding: "0",
    cellSpacing: "0",
    border: "0",
  }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {
    style: { borderRadius: "999px", backgroundColor: action.tone === "danger" ? dangerColor : accentColor },
  }, React.createElement("a", {
    href: action.href ?? "#",
    style: {
      display: "inline-block",
      padding: "13px 26px",
      fontFamily: fontStack,
      fontSize: "14px",
      fontWeight: "bold",
      color: whiteColor,
      textDecoration: "none",
      borderRadius: "999px",
    },
  }, action.label)))));
}

function KeyValueRows({ rows }) {
  const normalized = normalizeArray(rows).filter((row) => row?.label && row?.value);
  if (!normalized.length) return null;
  return React.createElement("table", {
    role: "presentation",
    width: "100%",
    cellPadding: "0",
    cellSpacing: "0",
    border: "0",
    style: { fontFamily: fontStack, fontSize: "14px", color: secondaryColor },
  }, React.createElement("tbody", null, normalized.map((row, index) => React.createElement("tr", { key: row.key ?? row.label }, [
    React.createElement("td", {
      key: "label",
      style: { padding: "8px 0", borderBottom: index === normalized.length - 1 ? "0" : `1px solid ${softBorderColor}` },
    }, row.label),
    React.createElement("td", {
      key: "value",
      align: "right",
      style: {
        padding: "8px 0",
        borderBottom: index === normalized.length - 1 ? "0" : `1px solid ${softBorderColor}`,
        color: brandColor,
        fontFamily: row.mono ? monoStack : fontStack,
        fontWeight: row.strong ? "bold" : "normal",
      },
    }, row.value),
  ]))));
}

function MetricCell({ metric }) {
  return React.createElement("td", {
    className: paddingClass,
    width: "50%",
    style: { padding: metric.offset ? "8px 32px 8px 8px" : "8px 32px", width: "50%" },
  }, React.createElement("table", {
    role: "presentation",
    width: "100%",
    cellPadding: "0",
    cellSpacing: "0",
    border: "0",
    style: { backgroundColor: pageColor, borderRadius: "14px" },
  }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {
    style: { padding: "16px 18px", fontFamily: fontStack },
  }, [
    React.createElement("div", {
      key: "label",
      style: { fontSize: "11px", fontWeight: "bold", letterSpacing: "0.6px", textTransform: "uppercase", color: mutedColor },
    }, metric.label),
    React.createElement("div", {
      key: "value",
      style: { fontSize: "22px", fontWeight: "bold", color: brandColor, paddingTop: "4px" },
    }, metric.value),
    metric.delta ? React.createElement("div", {
      key: "delta",
      style: { fontSize: "12px", fontWeight: "bold", color: toneColor(metric.tone ?? "success"), paddingTop: "2px" },
    }, metric.delta) : null,
  ])))));
}

function MetricsGrid({ metrics }) {
  const normalized = normalizeArray(metrics).filter((metric) => metric?.label && metric?.value);
  if (!normalized.length) return null;
  const pairs = [];
  for (let index = 0; index < normalized.length; index += 2) {
    pairs.push(normalized.slice(index, index + 2));
  }
  return pairs.map((pair, pairIndex) => React.createElement("table", {
    key: `metrics-${pairIndex}`,
    role: "presentation",
    width: "100%",
    cellPadding: "0",
    cellSpacing: "0",
    border: "0",
  }, React.createElement("tbody", null, React.createElement("tr", null, pair.map((metric, index) => React.createElement(MetricCell, {
    key: metric.key ?? metric.label,
    metric: { ...metric, offset: index === 1 },
  }))))));
}

function AlertList({ title, items }) {
  const normalized = normalizeArray(items).filter(Boolean);
  if (!normalized.length) return null;
  const heading = title ? React.createElement("div", {
    style: { fontFamily: fontStack, fontSize: "14px", fontWeight: "bold", color: brandColor, paddingBottom: "12px" },
  }, title) : null;
  const table = React.createElement("table", {
    role: "presentation",
    width: "100%",
    cellPadding: "0",
    cellSpacing: "0",
    border: "0",
    style: { fontFamily: fontStack, fontSize: "13.5px", color: secondaryColor },
  }, React.createElement("tbody", null, normalized.map((item, index) => React.createElement("tr", { key: item.key ?? item }, React.createElement("td", {
    style: { padding: "8px 0", borderBottom: index === normalized.length - 1 ? "0" : `1px solid ${softBorderColor}` },
  }, item.label ?? item)))));
  return React.createElement(React.Fragment, null, heading, table);
}

function CodeBlock({ code, helper }) {
  if (!code) return null;
  return React.createElement(React.Fragment, null,
    React.createElement("div", {
      style: {
        fontFamily: fontStack,
        fontSize: "13px",
        fontWeight: "bold",
        letterSpacing: "0.6px",
        textTransform: "uppercase",
        color: mutedColor,
        textAlign: "center",
      },
    }, "Verification code"),
    React.createElement(Spacer, { size: 8 }),
    React.createElement("table", {
      role: "presentation",
      width: "100%",
      cellPadding: "0",
      cellSpacing: "0",
      border: "0",
    }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", { align: "center" }, React.createElement("table", {
      role: "presentation",
      cellPadding: "0",
      cellSpacing: "0",
      border: "0",
      style: { backgroundColor: pageColor, borderRadius: "14px" },
    }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {
      style: { padding: "14px 28px", fontFamily: monoStack, fontSize: "32px", fontWeight: "bold", letterSpacing: "8px", color: brandColor },
    }, code)))))))),
    helper ? React.createElement(React.Fragment, null,
      React.createElement(Spacer, { size: 8 }),
      React.createElement("div", { style: { fontFamily: fontStack, fontSize: "12.5px", color: mutedColor, textAlign: "center" } }, helper)) : null);
}

function StepList({ steps }) {
  const normalized = normalizeArray(steps).filter(Boolean);
  if (!normalized.length) return null;
  return React.createElement("table", {
    role: "presentation",
    width: "100%",
    cellPadding: "0",
    cellSpacing: "0",
    border: "0",
    style: { fontFamily: fontStack },
  }, React.createElement("tbody", null, normalized.map((step, index) => React.createElement("tr", { key: step.key ?? step.label ?? index }, [
    React.createElement("td", {
      key: "number",
      width: "36",
      valign: "top",
      style: { padding: "10px 0", color: successColor, fontWeight: "bold", fontSize: "15px" },
    }, String(index + 1)),
    React.createElement("td", {
      key: "label",
      style: { padding: "10px 0", fontSize: "14px", color: brandColor, borderBottom: index === normalized.length - 1 ? "0" : `1px solid ${softBorderColor}` },
    }, step.label ?? step),
  ]))));
}

function variantDefaults(variant) {
  if (variant === "transactional") {
    return {
      title: "Cargo registrado · Flow",
      preheader: "Cargo de $820.50 en Pemex Reforma con tu tarjeta Flow",
      eyebrow: "Cargo registrado",
      headline: "-$820.50",
      body: "Pemex Reforma · hoy 14:32",
      rows: [
        { label: "Tarjeta", value: "•••• 4821 (Flota)", mono: true, strong: true },
        { label: "Categoria", value: "Combustible" },
        { label: "Consumo", value: "42.3 L", mono: true },
        { label: "Conductor", value: "Ana Sosa" },
      ],
      action: { label: "Ver detalle en Flow" },
      note: "¿No reconoces este cargo? Repórtalo desde Flow.",
    };
  }
  if (variant === "operational-summary") {
    return {
      title: "Resumen semanal · Flow",
      preheader: "Tu resumen semanal: 412 viajes, $48.2k, 3 alertas",
      eyebrow: "Resumen semanal",
      headline: "Hola Marta, esto pasó del 1 al 7 de julio",
      metrics: [
        { label: "Viajes", value: "412", delta: "+12% vs sem. pasada" },
        { label: "Ingreso", value: "$48.2k", delta: "+8%" },
        { label: "Gasto en combustible", value: "$18.4k", delta: "-4%" },
        { label: "Alertas abiertas", value: "3", delta: "-2 vs sem. pasada" },
      ],
      alertsTitle: "Requiere tu atención",
      alerts: ["KTR-882-A: consumo 38% sobre promedio", "Tag de peaje de PLQ-472-D vence en 5 días"],
      action: { label: "Ver dashboard completo" },
    };
  }
  if (variant === "security-alert") {
    return {
      title: "Verifica tu identidad · Flow",
      preheader: "Código de verificación solicitado desde un dispositivo nuevo",
      eyebrow: "Nuevo inicio de sesión",
      headline: "Verifica que fuiste tú",
      body: "Detectamos un intento de inicio de sesión desde un dispositivo nuevo.",
      rows: [
        { label: "Dispositivo", value: "Windows · Chrome 126" },
        { label: "Ubicación aproximada", value: "Ciudad de México, MX" },
        { label: "Hora", value: "hoy 09:14" },
      ],
      code: "482 917",
      codeHelper: "Válido por 10 minutos.",
      note: "Si no fuiste tú, protege tu cuenta ahora y cambia tu contraseña.",
      tone: "warning",
    };
  }
  if (variant === "team-invite") {
    return {
      title: "Invitación a Flow",
      preheader: "Marta Vidal te invitó a unirte a la flota en Flow",
      eyebrow: "Invitación al equipo",
      headline: "Marta Vidal te invitó a unirte a Transportes Vidal en Flow",
      body: "Vas a colaborar con el rol de Operaciones: podrás ver unidades, editarlas y exportar reportes.",
      action: { label: "Aceptar invitación" },
      note: "Esta invitación expira en 7 días. Si no esperabas este correo, puedes ignorarlo.",
    };
  }
  if (variant === "welcome") {
    return {
      title: "Bienvenida a Flow",
      preheader: "Tu cuenta Flow está lista",
      eyebrow: "Cuenta verificada",
      headline: "Bienvenida a Flow, Ana",
      body: "Tu identidad quedó verificada y tu primera tarjeta está lista para usarse. Estos son tus siguientes pasos:",
      steps: [
        "Activa notificaciones para saber al instante de cada cargo",
        "Configura Face ID o tu huella para entrar más rápido",
        "Explora Rutas para encontrar la gasolinera más barata cerca de ti",
      ],
      action: { label: "Abrir Flow" },
    };
  }
  return {
    title: "Flow mailing",
    preheader: "Flow account update",
    eyebrow: "Flow",
    headline: "Título del correo",
    body: "Cuerpo del mensaje.",
    action: { label: "Acción principal" },
  };
}

export const EmailTemplateLayout = forwardRef(function EmailTemplateLayout({
  variant,
  density = "md",
  state = "default",
  lang = "es",
  brand = "Flow",
  title,
  preheader,
  eyebrow,
  headline,
  body,
  tone,
  action,
  rows,
  metrics,
  alertsTitle,
  alerts,
  code,
  codeHelper,
  steps,
  note,
  footer,
  ...rest
}, ref) {
  const resolvedVariant = resolveVariant(variant);
  const defaults = variantDefaults(resolvedVariant);
  const resolvedTone = tone ?? defaults.tone ?? "accent";
  const resolvedAction = action ?? defaults.action;
  const resolvedRows = rows ?? defaults.rows;
  const resolvedMetrics = metrics ?? defaults.metrics;
  const resolvedAlerts = alerts ?? defaults.alerts;
  const resolvedSteps = steps ?? defaults.steps;
  const hiddenPreheader = text(preheader, defaults.preheader);

  return React.createElement("html", {
    ref,
    lang,
    xmlns: "http://www.w3.org/1999/xhtml",
    "data-flow-pattern": "email-template-layout",
    "data-flow-channel": "email",
    "data-email-template-variant": resolvedVariant,
    "data-density": density,
    "data-state": state,
    ...sanitizeRestProps(rest),
  }, [
    React.createElement("head", { key: "head" }, [
      React.createElement("meta", { key: "charset", charSet: "utf-8" }),
      React.createElement("meta", { key: "viewport", name: "viewport", content: "width=device-width, initial-scale=1.0" }),
      React.createElement("meta", { key: "apple", name: "x-apple-disable-message-reformatting" }),
      React.createElement("meta", { key: "edge", httpEquiv: "X-UA-Compatible", content: "IE=edge" }),
      React.createElement("title", { key: "title" }, text(title, defaults.title)),
      React.createElement("style", { key: "style" }, `body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}body{margin:0;padding:0;width:100% !important;background-color:${pageColor};}a{color:${linkColor};}@media only screen and (max-width:600px){.${containerClass}{width:100% !important;}.${paddingClass}{padding-left:20px !important;padding-right:20px !important;}}`),
    ]),
    React.createElement("body", {
      key: "body",
      style: { margin: 0, padding: 0, backgroundColor: pageColor },
    }, [
      React.createElement("div", {
        key: "preheader",
        style: {
          display: "none",
          fontSize: "1px",
          lineHeight: "1px",
          maxHeight: 0,
          maxWidth: 0,
          opacity: 0,
          overflow: "hidden",
          msoHide: "all",
          fontFamily: "sans-serif",
        },
      }, hiddenPreheader),
      React.createElement("table", {
        key: "page",
        role: "presentation",
        width: "100%",
        cellPadding: "0",
        cellSpacing: "0",
        border: "0",
        style: { backgroundColor: pageColor },
      }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {
        align: "center",
        style: { padding: "32px 16px" },
      }, React.createElement("table", {
        role: "presentation",
        className: containerClass,
        width: "600",
        cellPadding: "0",
        cellSpacing: "0",
        border: "0",
        style: { width: "600px", maxWidth: "600px" },
      }, React.createElement("tbody", null, [
        React.createElement("tr", { key: "brand" }, React.createElement("td", {
          align: "center",
          style: { padding: "0 0 24px" },
        }, React.createElement("div", { style: { fontFamily: fontStack, fontSize: "20px", fontWeight: "bold", color: brandColor, letterSpacing: "-0.5px" } }, brand))),
        React.createElement("tr", { key: "card" }, React.createElement("td", {
          style: { backgroundColor: whiteColor, border: `1px solid ${borderColor}`, borderRadius: "20px", overflow: "hidden" },
        }, React.createElement("table", {
          role: "presentation",
          width: "100%",
          cellPadding: "0",
          cellSpacing: "0",
          border: "0",
        }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {
          className: paddingClass,
          style: { padding: "32px 32px", fontFamily: fontStack },
        }, [
          React.createElement("div", {
            key: "eyebrow",
            style: { fontFamily: fontStack, fontSize: "13px", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase", color: toneColor(resolvedTone) },
          }, text(eyebrow, defaults.eyebrow)),
          React.createElement(Spacer, { key: "eyebrow-space", size: 8 }),
          React.createElement("div", {
            key: "headline",
            style: { fontFamily: fontStack, fontSize: resolvedVariant === "transactional" ? "34px" : "22px", fontWeight: "bold", color: brandColor, lineHeight: resolvedVariant === "transactional" ? "40px" : "29px" },
          }, text(headline, defaults.headline)),
          text(body, defaults.body) ? React.createElement(React.Fragment, { key: "body" }, [
            React.createElement(Spacer, { key: "body-space", size: 12 }),
            React.createElement("div", { key: "body-text", style: { fontFamily: fontStack, fontSize: "14px", color: secondaryColor, lineHeight: "21px" } }, text(body, defaults.body)),
          ]) : null,
          resolvedRows?.length ? React.createElement(React.Fragment, { key: "rows" }, [
            React.createElement(Spacer, { key: "rows-space", size: 20 }),
            React.createElement(KeyValueRows, { key: "rows-table", rows: resolvedRows }),
          ]) : null,
          resolvedMetrics?.length ? React.createElement(React.Fragment, { key: "metrics" }, [
            React.createElement(Spacer, { key: "metrics-space", size: 16 }),
            React.createElement(MetricsGrid, { key: "metrics-grid", metrics: resolvedMetrics }),
          ]) : null,
          resolvedAlerts?.length ? React.createElement(React.Fragment, { key: "alerts" }, [
            React.createElement(Spacer, { key: "alerts-space", size: 20 }),
            React.createElement(AlertList, { key: "alerts-list", title: alertsTitle ?? defaults.alertsTitle, items: resolvedAlerts }),
          ]) : null,
          code ?? defaults.code ? React.createElement(React.Fragment, { key: "code" }, [
            React.createElement(Spacer, { key: "code-space", size: 24 }),
            React.createElement(CodeBlock, { key: "code-block", code: code ?? defaults.code, helper: codeHelper ?? defaults.codeHelper }),
          ]) : null,
          resolvedSteps?.length ? React.createElement(React.Fragment, { key: "steps" }, [
            React.createElement(Spacer, { key: "steps-space", size: 16 }),
            React.createElement(StepList, { key: "steps-list", steps: resolvedSteps }),
          ]) : null,
          resolvedAction?.label ? React.createElement(React.Fragment, { key: "action" }, [
            React.createElement(Spacer, { key: "action-space", size: 24 }),
            React.createElement(ButtonLink, { key: "button", action: resolvedAction }),
          ]) : null,
          text(note, defaults.note) ? React.createElement(React.Fragment, { key: "note" }, [
            React.createElement(Spacer, { key: "note-space", size: 16 }),
            React.createElement("div", { key: "note-copy", style: { fontFamily: fontStack, fontSize: "12.5px", color: mutedColor, lineHeight: "18px" } }, text(note, defaults.note)),
          ]) : null,
        ])))))),
        React.createElement("tr", { key: "footer" }, React.createElement("td", {
          className: paddingClass,
          style: { padding: "28px 24px 0", textAlign: "center", fontFamily: fontStack, fontSize: "12px", lineHeight: "18px", color: mutedColor },
        }, footer ?? "Flow Mobility S.A. de C.V. · Preferencias · Darse de baja · © 2026 Flow Mobility")),
      ])))))),
    ]),
  ]);
});

EmailTemplateLayout.displayName = "EmailTemplateLayout";
