/**
 * Copy-email buttons, shared by every page and component that has one (the contact page and the
 * footer both do, so /contact has two). Markup:
 *   <button type="button" data-copy-email="address" hidden>
 *     <span data-copy-label aria-live="polite">Copy email</span>
 *   </button>
 * Buttons ship `hidden` (without JS the address itself stays a mailto link) and are revealed here.
 * Each button reports through its own label only, so one click gives one announcement. On failure
 * the label stays short ("Copy failed") and a wrapping hint after the button, linked with
 * aria-describedby, says what to do instead. Calling this more than once is safe: a button is
 * wired once.
 */
const RESET_MS = 2400;

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API unavailable or denied: fall back to a selected, offscreen textarea, and give
    // focus back to the control that asked (selecting the textarea moves it).
    const prev = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.append(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    prev?.focus({ preventScroll: true });
    return ok;
  }
}

export function wireCopyEmail(root: ParentNode = document): void {
  for (const btn of root.querySelectorAll<HTMLButtonElement>('[data-copy-email]')) {
    if (btn.dataset.copyWired !== undefined) continue;
    btn.dataset.copyWired = '';
    btn.hidden = false;
    const label = btn.querySelector<HTMLElement>('[data-copy-label]');
    const idle = label?.textContent ?? '';
    const hint = document.createElement('span');
    hint.className = 'copy-hint';
    hint.id = `copy-hint-${Math.random().toString(36).slice(2, 8)}`;
    hint.textContent = 'Select the email address instead.';
    hint.hidden = true;
    btn.after(hint);
    btn.setAttribute('aria-describedby', hint.id);
    let timer: number | undefined;
    btn.addEventListener('click', async () => {
      const ok = await copy(btn.dataset.copyEmail ?? '');
      if (label) label.textContent = ok ? 'Copied' : 'Copy failed';
      hint.hidden = ok;
      btn.dataset.state = ok ? 'copied' : 'failed';
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (label) label.textContent = idle;
        hint.hidden = true;
        delete btn.dataset.state;
      }, RESET_MS);
    });
  }
}
