# FlowDocs Legacy Slot Quarantine

Status: **action_required**

Decision: **legacy-html-slots-are-explicitly-quarantined-but-still-blocking**

## Slots

| status | id | kind | file | marker | exit | activeInnerHtml | replacement |
| --- | --- | --- | --- | --- | --- | --- | --- |
| quarantined-active | LegacyHtmlPageSlot | page | ../FlowDocs/apps/docs/docs-shell-react.js | true | true | true | typed-react-page-children |
| quarantined-active | LegacyHtmlTabSlot | tab | ../FlowDocs/apps/docs/template-react-islands.js | true | true | true | typed-react-tab-children |

## Exit Gate

- LegacyHtmlPageSlot must be removed when app routes pass typed React children into DocsShellTemplate.
- LegacyHtmlTabSlot must be removed when DocsArtifactDetailTemplate owns selected tab body/state.
- No new data-legacy-html-slot values may be introduced without a replacement field and audit row.
- FlowDocs cannot be called trustworthy while any quarantined-active slot remains.
