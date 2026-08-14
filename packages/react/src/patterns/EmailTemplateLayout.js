/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, } from "react";
// @ts-expect-error Style Dictionary owns this generated email-token output; it intentionally has no maintained TS source.
import { emailTokenValues } from "../internal/email-token-values.js";
const typedEmailTokenValues = emailTokenValues;
const token = (name) => typedEmailTokenValues[name] ?? "";
const brandColor = token("sys-email-color-text-primary");
const mutedColor = token("sys-email-color-text-muted");
const secondaryColor = token("sys-email-color-text-secondary");
const pageColor = token("sys-email-color-page");
const borderColor = token("sys-email-color-border");
const softBorderColor = token("sys-email-color-border-soft");
const accentColor = token("sys-email-color-accent");
const linkColor = token("sys-email-color-link");
const successColor = token("sys-email-color-success");
const warningColor = token("sys-email-color-warning");
const dangerColor = token("sys-email-color-danger");
const whiteColor = token("sys-email-color-white");
const fontStack = token("sys-email-font-family-body");
const monoStack = token("sys-email-font-family-mono");
const fallbackFontStack = token("sys-email-font-family-fallback");
const emailHiddenSize = token("sys-email-font-size-hidden");
const emailFontSizeXs = token("sys-email-font-size-xs");
const emailFontSizeSm = token("sys-email-font-size-sm");
const emailFontSizeNote = token("sys-email-font-size-note");
const emailFontSizeCodeLabel = token("sys-email-font-size-code-label");
const emailFontSizeList = token("sys-email-font-size-list");
const emailFontSizeBody = token("sys-email-font-size-body");
const emailFontSizeStep = token("sys-email-font-size-step");
const emailFontSizeBrand = token("sys-email-font-size-brand");
const emailFontSizeHeadline = token("sys-email-font-size-headline");
const emailFontSizeTransactionalHeadline = token("sys-email-font-size-transactional-headline");
const emailFontSizeCode = token("sys-email-font-size-code");
const emailLineHeightHidden = token("sys-email-line-height-hidden");
const emailLineHeightNote = token("sys-email-line-height-note");
const emailLineHeightBody = token("sys-email-line-height-body");
const emailLineHeightHeadline = token("sys-email-line-height-headline");
const emailLineHeightTransactionalHeadline = token("sys-email-line-height-transactional-headline");
const emailLetterSpacingTight = token("sys-email-letter-spacing-tight");
const emailLetterSpacingLabel = token("sys-email-letter-spacing-label");
const emailLetterSpacingEyebrow = token("sys-email-letter-spacing-eyebrow");
const emailLetterSpacingCode = token("sys-email-letter-spacing-code");
const emailBorderWidth = token("sys-email-border-width");
const emailRadiusCard = token("sys-email-radius-card");
const emailRadiusPill = token("sys-email-radius-pill");
const emailRadiusMetric = token("sys-email-radius-metric");
const emailSpaceXxs = token("sys-email-space-xxs");
const emailSpaceXs = token("sys-email-space-xs");
const emailSpaceSm = token("sys-email-space-sm");
const emailSpaceMd = token("sys-email-space-md");
const emailSpaceLg = token("sys-email-space-lg");
const emailSpaceXl = token("sys-email-space-xl");
const emailSpace2xl = token("sys-email-space-2xl");
const emailSpace3xl = token("sys-email-space-3xl");
const emailSpace4xl = token("sys-email-space-4xl");
const emailSpace5xl = token("sys-email-space-5xl");
const emailSpace6xl = token("sys-email-space-6xl");
const emailSpace7xl = token("sys-email-space-7xl");
const emailContentWidth = token("sys-email-content-width");
const containerClass = "flow-" + "container";
const paddingClass = "flow-" + "px";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
}
function toneColor(tone) {
    if (tone === "success")
        return successColor;
    if (tone === "warning")
        return warningColor;
    if (tone === "danger")
        return dangerColor;
    if (tone === "neutral")
        return mutedColor;
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
        style: { height: size, lineHeight: size, fontSize: emailHiddenSize },
    }, "\u00a0");
}
function ButtonLink({ action }) {
    if (!action?.label)
        return null;
    return React.createElement("table", {
        role: "presentation",
        cellPadding: "0",
        cellSpacing: "0",
        border: "0",
    }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {
        style: { borderRadius: emailRadiusPill, backgroundColor: action.tone === "danger" ? dangerColor : accentColor },
    }, React.createElement("a", {
        href: action.href ?? "#",
        style: {
            display: "inline-block",
            padding: `${emailFontSizeCodeLabel} ${emailSpace5xl}`,
            fontFamily: fontStack,
            fontSize: emailFontSizeBody,
            fontWeight: "bold",
            color: whiteColor,
            textDecoration: "none",
            borderRadius: emailRadiusPill,
        },
    }, action.label)))));
}
function KeyValueRows({ rows }) {
    const normalized = normalizeArray(rows).filter((row) => Boolean(row?.label && row?.value));
    if (!normalized.length)
        return null;
    return React.createElement("table", {
        role: "presentation",
        width: "100%",
        cellPadding: "0",
        cellSpacing: "0",
        border: "0",
        style: { fontFamily: fontStack, fontSize: emailFontSizeBody, color: secondaryColor },
    }, React.createElement("tbody", null, normalized.map((row, index) => React.createElement("tr", { key: row.key ?? row.label }, [
        React.createElement("td", {
            key: "label",
            style: { padding: `${emailSpaceSm} 0`, borderBottom: index === normalized.length - 1 ? "0" : `${emailBorderWidth} solid ${softBorderColor}` },
        }, row.label),
        React.createElement("td", {
            key: "value",
            align: "right",
            style: {
                padding: `${emailSpaceSm} 0`,
                borderBottom: index === normalized.length - 1 ? "0" : `${emailBorderWidth} solid ${softBorderColor}`,
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
        style: { padding: metric.offset ? `${emailSpaceSm} ${emailSpace7xl} ${emailSpaceSm} ${emailSpaceSm}` : `${emailSpaceSm} ${emailSpace7xl}`, width: "50%" },
    }, React.createElement("table", {
        role: "presentation",
        width: "100%",
        cellPadding: "0",
        cellSpacing: "0",
        border: "0",
        style: { backgroundColor: pageColor, borderRadius: emailRadiusMetric },
    }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {
        style: { padding: `${emailSpaceXl} ${emailSpace2xl}`, fontFamily: fontStack },
    }, [
        React.createElement("div", {
            key: "label",
            style: { fontSize: emailFontSizeXs, fontWeight: "bold", letterSpacing: emailLetterSpacingLabel, textTransform: "uppercase", color: mutedColor },
        }, metric.label),
        React.createElement("div", {
            key: "value",
            style: { fontSize: emailFontSizeHeadline, fontWeight: "bold", color: brandColor, paddingTop: emailSpaceXs },
        }, metric.value),
        metric.delta ? React.createElement("div", {
            key: "delta",
            style: { fontSize: emailFontSizeSm, fontWeight: "bold", color: toneColor(metric.tone ?? "success"), paddingTop: emailSpaceXxs },
        }, metric.delta) : null,
    ])))));
}
function MetricsGrid({ metrics }) {
    const normalized = normalizeArray(metrics).filter((metric) => Boolean(metric?.label && metric?.value));
    if (!normalized.length)
        return null;
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
    if (!normalized.length)
        return null;
    const heading = title ? React.createElement("div", {
        style: { fontFamily: fontStack, fontSize: emailFontSizeBody, fontWeight: "bold", color: brandColor, paddingBottom: emailSpaceLg },
    }, title) : null;
    const table = React.createElement("table", {
        role: "presentation",
        width: "100%",
        cellPadding: "0",
        cellSpacing: "0",
        border: "0",
        style: { fontFamily: fontStack, fontSize: emailFontSizeList, color: secondaryColor },
    }, React.createElement("tbody", null, normalized.map((item, index) => {
        const label = typeof item === "string" ? item : item.label;
        const key = typeof item === "string" ? item : item.key ?? item.label;
        return React.createElement("tr", { key }, React.createElement("td", {
            style: { padding: `${emailSpaceSm} 0`, borderBottom: index === normalized.length - 1 ? "0" : `${emailBorderWidth} solid ${softBorderColor}` },
        }, label));
    })));
    return React.createElement(React.Fragment, null, heading, table);
}
function CodeBlock({ code, helper }) {
    if (!code)
        return null;
    return React.createElement(React.Fragment, null, React.createElement("div", {
        style: {
            fontFamily: fontStack,
            fontSize: emailFontSizeCodeLabel,
            fontWeight: "bold",
            letterSpacing: emailLetterSpacingLabel,
            textTransform: "uppercase",
            color: mutedColor,
            textAlign: "center",
        },
    }, "Verification code"), React.createElement(Spacer, { size: emailSpaceSm }), React.createElement("table", {
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
        style: { backgroundColor: pageColor, borderRadius: emailRadiusMetric },
    }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {
        style: { padding: `${emailRadiusMetric} ${emailSpace6xl}`, fontFamily: monoStack, fontSize: emailFontSizeCode, fontWeight: "bold", letterSpacing: emailLetterSpacingCode, color: brandColor },
    }, code)))))))), helper ? React.createElement(React.Fragment, null, React.createElement(Spacer, { size: emailSpaceSm }), React.createElement("div", { style: { fontFamily: fontStack, fontSize: emailFontSizeNote, color: mutedColor, textAlign: "center" } }, helper)) : null);
}
function StepList({ steps }) {
    const normalized = normalizeArray(steps).filter(Boolean);
    if (!normalized.length)
        return null;
    return React.createElement("table", {
        role: "presentation",
        width: "100%",
        cellPadding: "0",
        cellSpacing: "0",
        border: "0",
        style: { fontFamily: fontStack },
    }, React.createElement("tbody", null, normalized.map((step, index) => {
        const label = typeof step === "string" ? step : step.label;
        const key = typeof step === "string" ? step : step.key ?? step.label;
        return React.createElement("tr", { key: key ?? index }, [
            React.createElement("td", {
                key: "number",
                width: "36",
                valign: "top",
                style: { padding: `${emailSpaceMd} 0`, color: successColor, fontWeight: "bold", fontSize: emailFontSizeStep },
            }, String(index + 1)),
            React.createElement("td", {
                key: "label",
                style: { padding: `${emailSpaceMd} 0`, fontSize: emailFontSizeBody, color: brandColor, borderBottom: index === normalized.length - 1 ? "0" : `${emailBorderWidth} solid ${softBorderColor}` },
            }, label),
        ]);
    })));
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
export const EmailTemplateLayout = forwardRef(function EmailTemplateLayout({ variant, density = "md", state = "default", lang = "es", brand = "Flow", title, preheader, eyebrow, headline, body, tone, action, rows, metrics, alertsTitle, alerts, code, codeHelper, steps, note, footer, ...rest }, ref) {
    const resolvedVariant = resolveVariant(variant);
    const defaults = variantDefaults(resolvedVariant);
    const resolvedTone = tone ?? defaults.tone ?? "accent";
    const resolvedAction = action ?? defaults.action;
    const resolvedRows = rows ?? defaults.rows;
    const resolvedMetrics = metrics ?? defaults.metrics;
    const resolvedAlerts = alerts ?? defaults.alerts;
    const resolvedSteps = steps ?? defaults.steps;
    const hiddenPreheader = text(preheader, defaults.preheader);
    const preheaderStyle = {
        display: "none",
        fontSize: emailHiddenSize,
        lineHeight: emailLineHeightHidden,
        maxHeight: 0,
        maxWidth: 0,
        opacity: 0,
        overflow: "hidden",
        msoHide: "all",
        fontFamily: fallbackFontStack,
    };
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
            React.createElement("style", { key: "style" }, `body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}body{margin:0;padding:0;width:100% !important;background-color:${pageColor};}a{color:${linkColor};}@media only screen and (max-width:${emailContentWidth}){.${containerClass}{width:100% !important;}.${paddingClass}{padding-left:${emailSpace3xl} !important;padding-right:${emailSpace3xl} !important;}}`),
        ]),
        React.createElement("body", {
            key: "body",
            style: { margin: 0, padding: 0, backgroundColor: pageColor },
        }, [
            React.createElement("div", {
                key: "preheader",
                style: preheaderStyle,
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
                style: { padding: `${emailSpace7xl} ${emailSpaceXl}` },
            }, React.createElement("table", {
                role: "presentation",
                className: containerClass,
                width: "600",
                cellPadding: "0",
                cellSpacing: "0",
                border: "0",
                style: { width: emailContentWidth, maxWidth: emailContentWidth },
            }, React.createElement("tbody", null, [
                React.createElement("tr", { key: "brand" }, React.createElement("td", {
                    align: "center",
                    style: { padding: `0 0 ${emailSpace4xl}` },
                }, React.createElement("div", { style: { fontFamily: fontStack, fontSize: emailFontSizeBrand, fontWeight: "bold", color: brandColor, letterSpacing: emailLetterSpacingTight } }, brand))),
                React.createElement("tr", { key: "card" }, React.createElement("td", {
                    style: { backgroundColor: whiteColor, border: `${emailBorderWidth} solid ${borderColor}`, borderRadius: emailRadiusCard, overflow: "hidden" },
                }, React.createElement("table", {
                    role: "presentation",
                    width: "100%",
                    cellPadding: "0",
                    cellSpacing: "0",
                    border: "0",
                }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {
                    className: paddingClass,
                    style: { padding: `${emailSpace7xl} ${emailSpace7xl}`, fontFamily: fontStack },
                }, [
                    React.createElement("div", {
                        key: "eyebrow",
                        style: { fontFamily: fontStack, fontSize: emailFontSizeCodeLabel, fontWeight: "bold", letterSpacing: emailLetterSpacingEyebrow, textTransform: "uppercase", color: toneColor(resolvedTone) },
                    }, text(eyebrow, defaults.eyebrow)),
                    React.createElement(Spacer, { key: "eyebrow-space", size: emailSpaceSm }),
                    React.createElement("div", {
                        key: "headline",
                        style: { fontFamily: fontStack, fontSize: resolvedVariant === "transactional" ? emailFontSizeTransactionalHeadline : emailFontSizeHeadline, fontWeight: "bold", color: brandColor, lineHeight: resolvedVariant === "transactional" ? emailLineHeightTransactionalHeadline : emailLineHeightHeadline },
                    }, text(headline, defaults.headline)),
                    text(body, defaults.body) ? React.createElement(React.Fragment, { key: "body" }, [
                        React.createElement(Spacer, { key: "body-space", size: emailSpaceLg }),
                        React.createElement("div", { key: "body-text", style: { fontFamily: fontStack, fontSize: emailFontSizeBody, color: secondaryColor, lineHeight: emailLineHeightBody } }, text(body, defaults.body)),
                    ]) : null,
                    resolvedRows?.length ? React.createElement(React.Fragment, { key: "rows" }, [
                        React.createElement(Spacer, { key: "rows-space", size: emailSpace3xl }),
                        React.createElement(KeyValueRows, { key: "rows-table", rows: resolvedRows }),
                    ]) : null,
                    resolvedMetrics?.length ? React.createElement(React.Fragment, { key: "metrics" }, [
                        React.createElement(Spacer, { key: "metrics-space", size: emailSpaceXl }),
                        React.createElement(MetricsGrid, { key: "metrics-grid", metrics: resolvedMetrics }),
                    ]) : null,
                    resolvedAlerts?.length ? React.createElement(React.Fragment, { key: "alerts" }, [
                        React.createElement(Spacer, { key: "alerts-space", size: emailSpace3xl }),
                        React.createElement(AlertList, { key: "alerts-list", title: alertsTitle ?? defaults.alertsTitle, items: resolvedAlerts }),
                    ]) : null,
                    code ?? defaults.code ? React.createElement(React.Fragment, { key: "code" }, [
                        React.createElement(Spacer, { key: "code-space", size: emailSpace4xl }),
                        React.createElement(CodeBlock, { key: "code-block", code: code ?? defaults.code, helper: codeHelper ?? defaults.codeHelper }),
                    ]) : null,
                    resolvedSteps?.length ? React.createElement(React.Fragment, { key: "steps" }, [
                        React.createElement(Spacer, { key: "steps-space", size: emailSpaceXl }),
                        React.createElement(StepList, { key: "steps-list", steps: resolvedSteps }),
                    ]) : null,
                    resolvedAction?.label ? React.createElement(React.Fragment, { key: "action" }, [
                        React.createElement(Spacer, { key: "action-space", size: emailSpace4xl }),
                        React.createElement(ButtonLink, { key: "button", action: resolvedAction }),
                    ]) : null,
                    text(note, defaults.note) ? React.createElement(React.Fragment, { key: "note" }, [
                        React.createElement(Spacer, { key: "note-space", size: emailSpaceXl }),
                        React.createElement("div", { key: "note-copy", style: { fontFamily: fontStack, fontSize: emailFontSizeNote, color: mutedColor, lineHeight: emailLineHeightNote } }, text(note, defaults.note)),
                    ]) : null,
                ])))))),
                React.createElement("tr", { key: "footer" }, React.createElement("td", {
                    className: paddingClass,
                    style: { padding: `${emailSpace6xl} ${emailSpace4xl} 0`, textAlign: "center", fontFamily: fontStack, fontSize: emailFontSizeSm, lineHeight: emailLineHeightNote, color: mutedColor },
                }, footer ?? "Flow Mobility S.A. de C.V. · Preferencias · Darse de baja · © 2026 Flow Mobility")),
            ])))))),
        ]),
    ]);
});
EmailTemplateLayout.displayName = "EmailTemplateLayout";
