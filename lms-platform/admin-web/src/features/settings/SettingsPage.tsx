import { Link } from "react-router-dom";
import type { AccentId, FontScaleId } from "@lms/design-tokens";
import { accentPresets, fontScaleSteps, getScaledTypographyPx } from "@lms/design-tokens";
import { useAppTheme } from "../../theme/ThemeProvider";

const ACCENT_META: { id: AccentId; title: string; hint: string }[] = [
  { id: "navy", title: "Navy", hint: "Default operations blue" },
  { id: "ocean", title: "Ocean", hint: "Teal / cyan" },
  { id: "violet", title: "Violet", hint: "Product & creative" },
  { id: "emerald", title: "Emerald", hint: "Growth & success" },
  { id: "amber", title: "Amber", hint: "Warm highlight" },
];

const FONT_SCALE_OPTIONS: { id: FontScaleId; title: string; hint: string }[] = [
  { id: "compact", title: "Compact", hint: `${Math.round(fontScaleSteps.compact * 100)}%` },
  { id: "standard", title: "Standard", hint: `${Math.round(fontScaleSteps.standard * 100)}%` },
  { id: "comfortable", title: "Comfortable", hint: `${Math.round(fontScaleSteps.comfortable * 100)}%` },
];

const TEXT_PREVIEW: { level: 1 | 2 | 3 | 4; sample: string }[] = [
  { level: 1, sample: "Caption / meta text" },
  { level: 2, sample: "Body and inputs" },
  { level: 3, sample: "Section title" },
  { level: 4, sample: "Page title" },
];

export function SettingsPage() {
  const { mode, accent, fontScale, setMode, setAccent, setFontScale } = useAppTheme();
  const sizes = getScaledTypographyPx(fontScale);

  return (
    <div className="crm-page crm-page--dense crm-settings-page">
      <div className="crm-page-toolbar card">
        <div className="crm-page-toolbar__left">
          <span className="crm-page-toolbar__eyebrow">Preferences</span>
          <h1 className="crm-page-title">Settings</h1>
          <p className="crm-page-toolbar__hint" title="Appearance is stored in this browser and applied everywhere in the admin app immediately.">
            Theme and typography preferences for this browser
          </p>
        </div>
        <div className="crm-page-toolbar__controls">
          <Link className="crm-ghost-button" to="/configuration">
            Configuration
          </Link>
          <Link className="btn-primary btn-primary--compact" to="/leads">
            Leads
          </Link>
        </div>
      </div>

      <section className="card crm-settings-section" aria-labelledby="appearance-heading">
        <h2 id="appearance-heading" className="crm-type-3">
          Appearance
        </h2>
        <p className="crm-type-1 crm-settings-muted">
          Color on the left; text size scale and previews on the right. Everything saves in this browser and applies app-wide.
        </p>

        <div className="crm-settings-split">
          <div className="crm-settings-split-col crm-settings-split-col--color" aria-labelledby="color-col-heading">
            <h3 id="color-col-heading" className="crm-settings-subheading">
              Color
            </h3>
            <div className="crm-settings-block">
              <span className="crm-label-3">Mode</span>
              <div className="crm-segmented" role="group" aria-label="Color mode">
                <button
                  type="button"
                  className={mode === "light" ? "crm-segmented-btn is-active" : "crm-segmented-btn"}
                  onClick={() => setMode("light")}
                >
                  Light
                </button>
                <button
                  type="button"
                  className={mode === "dark" ? "crm-segmented-btn is-active" : "crm-segmented-btn"}
                  onClick={() => setMode("dark")}
                >
                  Dark
                </button>
              </div>
            </div>

            <div className="crm-settings-block">
              <span className="crm-label-3">Accent</span>
              <p className="crm-type-1 crm-settings-muted">Primary actions and focus use these hues.</p>
              <ul className="crm-accent-grid" role="list">
                {ACCENT_META.map((item) => {
                  const colors = accentPresets[item.id];
                  const selected = accent === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={selected ? "crm-accent-option is-selected" : "crm-accent-option"}
                        onClick={() => setAccent(item.id)}
                        aria-pressed={selected}
                        aria-label={`${item.title} accent`}
                      >
                        <span className="crm-accent-swatch" style={{ background: colors.primary }} aria-hidden />
                        <span className="crm-accent-swatch" style={{ background: colors.secondary }} aria-hidden />
                        <span className="crm-accent-meta">
                          <span className="crm-type-2">{item.title}</span>
                          <span className="crm-type-1 crm-settings-muted">{item.hint}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="crm-settings-split-col crm-settings-split-col--scale" aria-labelledby="scale-col-heading">
            <h3 id="scale-col-heading" className="crm-settings-subheading">
              Text size
            </h3>
            <p className="crm-type-1 crm-settings-muted">
              Four text steps across the UI. Label sizes scale with the same preset ({sizes.label[1]}px–{sizes.label[4]}px).
            </p>

            <div className="crm-settings-scale-stack">
              <span className="crm-label-3">Scale</span>
              <div className="crm-segmented crm-segmented--triple" role="group" aria-label="Text size scale">
                {FONT_SCALE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={fontScale === opt.id ? "crm-segmented-btn is-active" : "crm-segmented-btn"}
                    onClick={() => setFontScale(opt.id)}
                    aria-pressed={fontScale === opt.id}
                  >
                    {opt.title}
                  </button>
                ))}
              </div>
              <p className="crm-type-1 crm-settings-muted">
                {FONT_SCALE_OPTIONS.find((o) => o.id === fontScale)?.hint} of default token sizes.
              </p>

              <div className="crm-font-scale-preview" aria-live="polite">
                <div className="crm-font-scale-preview-head">
                  <span className="crm-label-2">Text steps</span>
                  <span className="crm-label-2">Size</span>
                </div>
                {TEXT_PREVIEW.map(({ level, sample }) => (
                  <div key={level} className="crm-font-scale-preview-row">
                    {level === 1 ? (
                      <p className="crm-type-1 crm-font-scale-preview-sample">{sample}</p>
                    ) : level === 2 ? (
                      <p className="crm-type-2 crm-font-scale-preview-sample">{sample}</p>
                    ) : level === 3 ? (
                      <p className="crm-type-3 crm-font-scale-preview-sample">{sample}</p>
                    ) : (
                      <p className="crm-type-4 crm-font-scale-preview-sample">{sample}</p>
                    )}
                    <span className="crm-font-scale-px" title={`Text level ${level}`}>
                      {sizes.text[level]}px
                    </span>
                  </div>
                ))}
              </div>

              <div className="crm-type-samples crm-type-samples--in-scale">
                <div>
                  <span className="crm-label-2">Labels (preview)</span>
                  <p>
                    <span className="crm-label-4">Label four</span>
                  </p>
                  <p>
                    <span className="crm-label-3">Label three</span>
                  </p>
                  <p>
                    <span className="crm-label-2">Label two</span>
                  </p>
                  <p>
                    <span className="crm-label-1">Label one</span>
                  </p>
                </div>
                <div className="crm-label-px-list" aria-label="Label step sizes in pixels">
                  <span className="crm-label-2">Sizes</span>
                  <p className="crm-font-scale-px">{sizes.label[4]}px</p>
                  <p className="crm-font-scale-px">{sizes.label[3]}px</p>
                  <p className="crm-font-scale-px">{sizes.label[2]}px</p>
                  <p className="crm-font-scale-px">{sizes.label[1]}px</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
