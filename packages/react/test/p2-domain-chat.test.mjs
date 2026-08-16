import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
globalThis.Event = dom.window.Event;
globalThis.KeyboardEvent = dom.window.KeyboardEvent;
globalThis.MouseEvent = dom.window.MouseEvent;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

const React = await import("react");
const axe = await import("axe-core");
const userEvent = await import("@testing-library/user-event");
const { cleanup, render } = await import("@testing-library/react");
const { ChatComposer, ChatMessage, ChatThread } = await import("../dist/index.js");

async function assertNoAxeViolations(container) {
  const results = await axe.default.run(container, {
    rules: {
      "color-contrast": { enabled: false },
      region: { enabled: false },
    },
  });
  assert.deepEqual(results.violations, []);
}

function createUser() {
  return userEvent.default.setup({ document: globalThis.document });
}

try {
  {
    const user = createUser();
    const changes = [];
    const sends = [];
    const attaches = [];
    const view = render(React.createElement(ChatComposer, {
      label: "Support message",
      helper: "Keep it short.",
      placeholder: "Write a message",
      defaultValue: "Hello",
      maxLength: 24,
      rows: 4,
      density: "lg",
      attachLabel: "Attach file",
      sendLabel: "Send now",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
      onSend: (value, event) => sends.push({ value, eventType: event.type }),
      onAttach: (event) => attaches.push(event.type),
    }));
    const form = view.getByRole("form", { name: /support message/i });
    const field = view.getByRole("textbox", { name: /support message/i });
    const send = view.getByRole("button", { name: /send now/i });
    const attach = view.getByRole("button", { name: /attach file/i });

    assert.equal(form.className, "surface chat-composer");
    assert.equal(form.dataset.flowPrimitive, "surface");
    assert.equal(form.dataset.flowComponent, "chat-composer");
    assert.equal(form.dataset.state, "filled");
    assert.equal(form.dataset.density, "lg");
    assert.equal(field.value, "Hello");
    assert.equal(field.getAttribute("rows"), "4");
    assert.equal(field.getAttribute("maxlength"), "24");
    assert.equal(send.disabled, false);
    assert.equal(attach.disabled, false);
    await user.click(attach);
    assert.deepEqual(attaches, ["click"]);
    await user.clear(field);
    await user.type(field, "Need help");
    assert.equal(changes.at(-1)?.value, "Need help");
    assert.deepEqual(changes.at(-1)?.meta, { maxLength: 24, length: 9 });
    await user.click(send);
    assert.deepEqual(sends.at(-1), { value: "Need help", eventType: "click" });
    assert.equal(field.value, "");

    view.rerender(React.createElement(ChatComposer, {
      label: "Locked message",
      value: "Still sending",
      sending: true,
      attachLabel: "Attach file",
      sendLabel: "Send now",
      onSend: (value, event) => sends.push({ value, eventType: event.type }),
    }));
    const lockedForm = view.getByRole("form", { name: /locked message/i });
    const lockedField = view.getByRole("textbox", { name: /locked message/i });
    const lockedSend = view.getByRole("button", { name: /send now/i });
    assert.equal(lockedForm.dataset.state, "sending");
    assert.equal(lockedField.disabled, true);
    assert.equal(lockedSend.disabled, true);
    const beforeSend = sends.length;
    await user.click(lockedSend);
    assert.equal(sends.length, beforeSend);

    view.rerender(React.createElement(ChatComposer, {
      label: "Recover message",
      value: "Retry",
      error: "Message failed",
      state: "filled",
      sendLabel: "Send now",
    }));
    const errorForm = view.getByRole("form", { name: /recover message/i });
    const errorField = view.getByRole("textbox", { name: /recover message/i });
    assert.equal(errorForm.dataset.state, "error");
    assert.equal(errorField.getAttribute("aria-invalid"), "true");
    assert.equal(view.getByText("Message failed").getAttribute("role"), "alert");

    view.rerender(React.createElement(ChatComposer, {}));
    assert.equal(view.getByRole("form", { name: /message/i }).dataset.state, "default");
    assert.equal(view.getByRole("textbox", { name: /message/i }).value, "");
    assert.equal(view.getByRole("button", { name: /send/i }).disabled, true);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const actions = [];
    const view = render(React.createElement(ChatMessage, {
      author: "agent",
      authorLabel: "Ana",
      avatar: { initials: "AN" },
      body: "I can help with that.",
      timestamp: "10:21",
      meta: "Support",
      state: "failed",
      tone: "danger",
      density: "sm",
      action: {
        label: "Retry",
        variant: "secondary",
        onClick: (event) => actions.push(event.type),
      },
    }));
    const message = view.getByRole("alert");
    const retry = view.getByRole("button", { name: /retry/i });

    assert.equal(message.className, "chat-message");
    assert.equal(message.dataset.flowComponent, "chat-message");
    assert.equal(message.dataset.author, "agent");
    assert.equal(message.dataset.state, "failed");
    assert.equal(message.dataset.tone, "danger");
    assert.equal(message.dataset.density, "sm");
    assert.equal(message.getAttribute("aria-live"), "assertive");
    assert.equal(view.getByText("Ana").className, "chat-message__author");
    assert.equal(view.getByText("10:21").className, "chat-message__time");
    assert.equal(view.getByText("Support").className, "chat-message__meta");
    assert.equal(view.getByText("I can help with that.").className, "chat-message__body");
    assert.equal(view.container.querySelector(".chat-message__bubble")?.dataset.flowPrimitive, "surface");
    await user.click(retry);
    assert.deepEqual(actions, ["click"]);

    view.rerender(React.createElement(ChatMessage, {
      author: "unknown",
      state: "unknown",
      tone: "unknown",
      body: "Fallback message",
    }));
    const fallback = view.container.querySelector(".chat-message");
    assert.equal(fallback?.dataset.author, "agent");
    assert.equal(fallback?.dataset.state, "default");
    assert.equal(fallback?.dataset.tone, "neutral");
    assert.equal(fallback?.getAttribute("role"), null);

    view.rerender(React.createElement(ChatMessage, {
      author: "system",
      state: "loading",
      tone: "warning",
    }));
    const loading = view.getByRole("status");
    assert.equal(loading.dataset.state, "loading");
    assert.equal(loading.getAttribute("aria-live"), "polite");
    assert.equal(view.container.querySelector(".chat-message__typing")?.getAttribute("aria-label"), "Message loading");

    view.rerender(React.createElement(ChatMessage, { body: "" }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const actionClicks = [];
    const messageActions = [];
    const emptyActions = [];
    const view = render(React.createElement(ChatThread, {
      label: "Agent conversation",
      description: "Messages from support.",
      density: "md",
      selectedMessageKey: "m2",
      messages: [
        {
          key: "m1",
          author: "agent",
          authorLabel: "Ana",
          body: "Welcome.",
          timestamp: "10:20",
          avatar: { initials: "AN" },
        },
        {
          key: "m2",
          author: "user",
          body: "I need help.",
          state: "sent",
          action: {
            label: "Quote",
            onClick: (event) => actionClicks.push(event.type),
          },
        },
        { key: "ignored" },
      ],
      onMessageAction: (key, event) => messageActions.push({ key, eventType: event.type }),
    }));
    const log = view.getByRole("log", { name: /agent conversation/i });
    const quote = view.getByRole("button", { name: /quote/i });

    assert.equal(log.className, "surface chat-thread");
    assert.equal(log.dataset.flowPrimitive, "surface");
    assert.equal(log.dataset.flowComponent, "chat-thread");
    assert.equal(log.dataset.state, "default");
    assert.equal(log.dataset.density, "md");
    assert.equal(log.dataset.selectedMessage, "m2");
    assert.equal(log.getAttribute("aria-live"), "polite");
    assert.equal(view.container.querySelectorAll(".chat-thread__item").length, 2);
    assert.equal(view.container.querySelector('.chat-thread__item[data-selected="true"] .chat-message')?.dataset.author, "user");
    await user.click(quote);
    assert.deepEqual(actionClicks, ["click"]);
    assert.deepEqual(messageActions.at(-1), { key: "m2", eventType: "click" });

    view.rerender(React.createElement(ChatThread, {
      label: "Empty conversation",
      messages: [],
      empty: {
        title: "No messages",
        description: "Start the conversation.",
        icon: "chat",
        action: { key: "start", label: "Start chat" },
        onAction: (key, event) => emptyActions.push({ key, eventType: event.type }),
      },
    }));
    const emptyLog = view.getByRole("log", { name: /empty conversation/i });
    assert.equal(emptyLog.dataset.state, "empty");
    await user.click(view.getByRole("button", { name: /start chat/i }));
    assert.deepEqual(emptyActions.at(-1), { key: "start", eventType: "click" });

    view.rerender(React.createElement(ChatThread, {
      label: "Offline conversation",
      state: "offline",
      messages: [{ key: "m1", body: "Hidden while offline" }],
    }));
    const offlineLog = view.getByRole("log", { name: /offline conversation/i });
    assert.equal(offlineLog.dataset.state, "offline");
    assert.equal(view.getByText("Reconnect to continue the conversation.").className, "empty-state__description");
    assert.equal(view.container.querySelector(".chat-message"), null);

    view.rerender(React.createElement(ChatThread, {
      label: "Loading conversation",
      state: "loading",
    }));
    const loadingLog = view.getByRole("log", { name: /loading conversation/i });
    assert.equal(loadingLog.dataset.state, "loading");
    assert.equal(loadingLog.getAttribute("aria-busy"), "true");
    assert.equal(view.getByText("Loading conversation").className, "empty-state__title");

    view.rerender(React.createElement(ChatThread, {
      label: "Invalid state conversation",
      state: "unknown",
      messages: [{ key: "m1", body: "Still rendered" }],
    }));
    const fallbackLog = view.getByRole("log", { name: /invalid state conversation/i });
    assert.equal(fallbackLog.dataset.state, "default");
    assert.equal(view.container.querySelectorAll(".chat-message").length, 1);

    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P2 domain chat production evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
}
