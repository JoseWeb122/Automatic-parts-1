import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { brands, products, vehicleModels, years, type Product } from "./data";

export type IconName =
  | "settings"
  | "arrow"
  | "arrow-up-right"
  | "phone"
  | "menu"
  | "close"
  | "check"
  | "check-circle"
  | "shield"
  | "clock"
  | "truck"
  | "engine"
  | "transmission"
  | "info"
  | "search"
  | "car"
  | "pin"
  | "calendar"
  | "plus"
  | "mail"
  | "clipboard"
  | "route"
  | "refresh"
  | "wrench"
  | "external"
  | "package";

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const shapes: Record<IconName, ReactNode> = {
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.3a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9h-.3a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2v-.3a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.3a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.9Z" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    "arrow-up-right": <path d="M7 17 17 7M7 7h10v10" />,
    phone: (
      <>
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 8.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.1Z" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m18 6-12 12M6 6l12 12" />,
    check: <path d="m5 12 4 4L19 6" />,
    "check-circle": (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16.5 9" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    truck: (
      <>
        <path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z" />
        <circle cx="7.5" cy="18" r="1.8" />
        <circle cx="17.5" cy="18" r="1.8" />
      </>
    ),
    engine: (
      <>
        <path d="M4 10h3l2-3h5l2 3h3v8h-3l-2 2H8l-1-2H4z" />
        <path d="M7 10V7H5M19 12h2v4h-2M10 10v3m4-3v3M9 16h5" />
      </>
    ),
    transmission: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
        <circle cx="7" cy="7" r="2" />
        <circle cx="17" cy="12" r="2" />
        <circle cx="9" cy="17" r="2" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5m0-8h.01" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    car: (
      <>
        <path d="m5 11 1.6-4.5A2.3 2.3 0 0 1 8.8 5h6.4a2.3 2.3 0 0 1 2.2 1.5L19 11" />
        <path d="M3 12h18v6H3zM6 18v2m12-2v2M6 14h.01M18 14h.01" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    plus: <path d="M12 5v14m-7-7h14" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4.5V3h6v1.5M9 10h6m-6 4h6m-6 4h3" />
      </>
    ),
    route: (
      <>
        <circle cx="6" cy="18" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <path d="M8.5 18h2a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3" />
      </>
    ),
    refresh: <path d="M20 7v5h-5M4 17v-5h5m-4.2-2a7.5 7.5 0 0 1 12.7-2.8L20 12M4 12l2.5 4.8A7.5 7.5 0 0 0 19 14" />,
    wrench: <path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4L14 13l-3-3 3.7-3.7Z" />,
    external: (
      <>
        <path d="M14 3h7v7m-1-6-9 9" />
        <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
      </>
    ),
    package: (
      <>
        <path d="m12 3 9 5v8l-9 5-9-5V8l9-5Z" />
        <path d="m3 8 9 5 9-5m-9 5v8m-4-16 9 5" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes[name]}
    </svg>
  );
}

export function BrandLogo({ hero = false }: { hero?: boolean }) {
  if (hero) {
    return (
      <div className="hero-brand" aria-label="Asante Used Auto Parts">
        <span className="brand-mark">
          <Icon name="settings" className="h-6 w-6" />
        </span>
        <span className="hero-brand-name">
          <strong>ASANTE</strong>
          <span>USED AUTO PARTS</span>
        </span>
      </div>
    );
  }

  return (
    <a className="brand-lockup" href="#home" aria-label="Asante Used Auto Parts home">
      <span className="brand-mark">
        <Icon name="settings" className="h-5 w-5" />
      </span>
      <span className="brand-type">
        <strong>ASANTE</strong>
        <span>Used Auto Parts</span>
      </span>
    </a>
  );
}

export function ModalShell({
  title,
  children,
  onClose,
  narrow = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  narrow?: boolean;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`modal-card${narrow ? " modal-narrow" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ProductCard({
  product,
  onDetails,
  onRequest,
}: {
  product: Product;
  onDetails: (product: Product) => void;
  onRequest: (product: Product) => void;
}) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              product.category === "Engine"
                ? "/images/asante-hero.jpg"
                : "/images/transmission-assembly.jpg";
          }}
        />
        <span className="product-category-badge">
          <Icon name={product.category === "Engine" ? "engine" : "transmission"} className="h-3.5 w-3.5" />
          {product.category}
        </span>
      </div>
      <div className="product-card-body">
        <div className="product-meta">
          <span>{product.make}</span>
          <span>Demo listing</span>
        </div>
        <h3>{product.title}</h3>
        <p className="product-fitment">
          <Icon name="car" className="h-4 w-4" />
          <span>
            {product.years} {product.make} {product.model} · {product.engineSize}
          </span>
        </p>
        <p className="product-condition">Used — inspection details upon request</p>
        <div className="product-price-row">
          <div>
            <span className="sample-price-label">Sample price · confirm</span>
            <span className="sample-price">${product.price.toLocaleString("en-US")}</span>
          </div>
          <button className="button-text" type="button" onClick={() => onDetails(product)}>
            View details <Icon name="arrow-up-right" className="h-4 w-4" />
          </button>
        </div>
        <div className="product-actions">
          <button className="button-light" type="button" onClick={() => onDetails(product)}>
            View Details
          </button>
          <button className="button-primary" type="button" onClick={() => onRequest(product)}>
            Request This Part <Icon name="arrow" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export type RequestValues = {
  fullName: string;
  phone: string;
  email: string;
  year: string;
  make: string;
  model: string;
  category: string;
  engineDetails: string;
  vin: string;
  zip: string;
  preferredOption: string;
  details: string;
  contactMethod: string;
};

const blankRequest: RequestValues = {
  fullName: "",
  phone: "",
  email: "",
  year: "",
  make: "",
  model: "",
  category: "",
  engineDetails: "",
  vin: "",
  zip: "",
  preferredOption: "",
  details: "",
  contactMethod: "Phone call",
};

type RequestErrors = Partial<Record<keyof RequestValues, string>>;

export function RequestForm({
  prefill = {},
}: {
  prefill?: Partial<RequestValues>;
}) {
  const [values, setValues] = useState<RequestValues>(() => ({ ...blankRequest, ...prefill }));
  const [errors, setErrors] = useState<RequestErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const formId = useId();

  const update = (key: keyof RequestValues, value: string) => {
    setValues((current) => ({
      ...current,
      [key]: value,
      ...(key === "make" ? { model: "" } : {}),
    }));
    setErrors((current) => ({ ...current, [key]: undefined, ...(key === "make" ? { model: undefined } : {}) }));
  };

  const validate = () => {
    const nextErrors: RequestErrors = {};
    if (!values.fullName.trim()) nextErrors.fullName = "Please enter your name.";
    if (!values.phone.trim()) nextErrors.phone = "Please enter a phone number.";
    else if (values.phone.replace(/\D/g, "").length < 7) nextErrors.phone = "Enter a valid phone number.";
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Enter a valid email address or leave this field blank.";
    }
    if (!values.year) nextErrors.year = "Select your vehicle year.";
    if (!values.make) nextErrors.make = "Select your vehicle make.";
    if (!values.model) nextErrors.model = "Select your vehicle model.";
    if (!values.category) nextErrors.category = "Select the part you need.";
    if (!values.zip.trim()) nextErrors.zip = "Enter a ZIP code.";
    else if (!/^\d{5}(?:-\d{4})?$/.test(values.zip.trim())) nextErrors.zip = "Enter a 5-digit ZIP code.";
    return nextErrors;
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setSubmitted(true);
  };

  const reset = () => {
    setValues({ ...blankRequest, ...prefill });
    setErrors({});
    setSubmitted(false);
  };

  const fieldError = (field: keyof RequestValues) => errors[field];
  const errorProps = (field: keyof RequestValues) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${formId}-${field}-error` : undefined,
  });

  if (submitted) {
    return (
      <div className="success-panel" role="status" aria-live="polite">
        <span className="success-icon"><Icon name="check" className="h-7 w-7" /></span>
        <h3>Your part request is ready.</h3>
        <p>
          Thank you for providing your vehicle details. This demonstration has recorded your request locally in the current page session. To send an actual inquiry, please contact Asante Used Auto Parts directly.
        </p>
        <div className="request-summary">
          <strong>Request summary</strong>
          <span>Contact: {values.fullName} · {values.phone}</span>
          <span>{values.year} {values.make} {values.model} · {values.category}</span>
          {values.engineDetails && <span>Part details: {values.engineDetails}</span>}
          {values.zip && <span>ZIP: {values.zip}</span>}
          {values.preferredOption && <span>Preference: {values.preferredOption}</span>}
          <span>Preferred contact: {values.contactMethod}</span>
          {values.details && <span>Notes: {values.details}</span>}
        </div>
        <button type="button" className="button-light" onClick={reset}>
          <Icon name="refresh" className="h-4 w-4" /> Request Another Part
        </button>
      </div>
    );
  }

  return (
    <div className="request-form-shell">
      <div className="request-form-head">
        <strong>Part & vehicle details</strong>
        <span><span className="required">*</span> Required fields</span>
      </div>
      <div className="request-form-body">
        <form onSubmit={submit} noValidate>
          <div className="request-fields-grid">
            <div className="form-field">
              <label className="form-label" htmlFor={`${formId}-name`}>Full name <span className="required">*</span></label>
              <input id={`${formId}-name`} className="control" autoComplete="name" value={values.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder="Your name" {...errorProps("fullName")} />
              {fieldError("fullName") && <p className="form-error" id={`${formId}-fullName-error`}>{fieldError("fullName")}</p>}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor={`${formId}-phone`}>Phone number <span className="required">*</span></label>
              <input id={`${formId}-phone`} className="control" type="tel" autoComplete="tel" value={values.phone} onChange={(event) => update("phone", event.target.value)} placeholder="(717) 555-0123" {...errorProps("phone")} />
              {fieldError("phone") && <p className="form-error" id={`${formId}-phone-error`}>{fieldError("phone")}</p>}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor={`${formId}-email`}>Email address <span className="field-hint">Optional</span></label>
              <input id={`${formId}-email`} className="control" type="email" autoComplete="email" value={values.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" {...errorProps("email")} />
              {fieldError("email") && <p className="form-error" id={`${formId}-email-error`}>{fieldError("email")}</p>}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor={`${formId}-zip`}>ZIP code <span className="required">*</span></label>
              <input id={`${formId}-zip`} className="control" inputMode="numeric" autoComplete="postal-code" value={values.zip} onChange={(event) => update("zip", event.target.value)} placeholder="e.g. 17401" {...errorProps("zip")} />
              {fieldError("zip") && <p className="form-error" id={`${formId}-zip-error`}>{fieldError("zip")}</p>}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor={`${formId}-year`}>Vehicle year <span className="required">*</span></label>
              <select id={`${formId}-year`} className="control" value={values.year} onChange={(event) => update("year", event.target.value)} {...errorProps("year")}>
                <option value="">Select year</option>
                {years.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
              {fieldError("year") && <p className="form-error" id={`${formId}-year-error`}>{fieldError("year")}</p>}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor={`${formId}-make`}>Vehicle make <span className="required">*</span></label>
              <select id={`${formId}-make`} className="control" value={values.make} onChange={(event) => update("make", event.target.value)} {...errorProps("make")}>
                <option value="">Select make</option>
                {[...brands, "Honda", "Chevrolet", "Nissan"].map((make) => <option key={make} value={make}>{make}</option>)}
              </select>
              {fieldError("make") && <p className="form-error" id={`${formId}-make-error`}>{fieldError("make")}</p>}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor={`${formId}-model`}>Vehicle model <span className="required">*</span></label>
              <select id={`${formId}-model`} className="control" disabled={!values.make} value={values.model} onChange={(event) => update("model", event.target.value)} {...errorProps("model")}>
                <option value="">{values.make ? "Select model" : "Choose a make first"}</option>
                {(vehicleModels[values.make] ?? []).map((model) => <option key={model} value={model}>{model}</option>)}
              </select>
              {fieldError("model") && <p className="form-error" id={`${formId}-model-error`}>{fieldError("model")}</p>}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor={`${formId}-category`}>Part needed <span className="required">*</span></label>
              <select id={`${formId}-category`} className="control" value={values.category} onChange={(event) => update("category", event.target.value)} {...errorProps("category")}>
                <option value="">Select a part</option>
                <option value="Engine">Engine</option>
                <option value="Transmission">Transmission</option>
                <option value="Other part">Other part</option>
              </select>
              {fieldError("category") && <p className="form-error" id={`${formId}-category-error`}>{fieldError("category")}</p>}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor={`${formId}-engine-details`}>Engine size or part number <span className="field-hint">Optional</span></label>
              <input id={`${formId}-engine-details`} className="control" value={values.engineDetails} onChange={(event) => update("engineDetails", event.target.value)} placeholder="e.g. 2.5L, code, or part number" />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor={`${formId}-vin`}>VIN <span className="field-hint">Optional</span></label>
              <input id={`${formId}-vin`} className="control" autoComplete="off" value={values.vin} onChange={(event) => update("vin", event.target.value)} placeholder="Optional vehicle identification number" />
              <p className="field-hint">A VIN may help confirm fitment. Do not include other sensitive information.</p>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor={`${formId}-option`}>Preferred option</label>
              <select id={`${formId}-option`} className="control" value={values.preferredOption} onChange={(event) => update("preferredOption", event.target.value)}>
                <option value="">Select an option</option>
                <option>Delivery</option>
                <option>Pickup</option>
                <option>Discuss installation</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor={`${formId}-contact-method`}>Preferred contact method</label>
              <select id={`${formId}-contact-method`} className="control" value={values.contactMethod} onChange={(event) => update("contactMethod", event.target.value)}>
                <option>Phone call</option>
                <option>Text message</option>
                <option>Email</option>
              </select>
            </div>
            <div className="form-field field-span-2">
              <label className="form-label" htmlFor={`${formId}-details`}>Anything else we should know? <span className="field-hint">Optional</span></label>
              <textarea id={`${formId}-details`} className="control textarea-control" value={values.details} onChange={(event) => update("details", event.target.value)} placeholder="Share existing engine or transmission details, your preferred timing, or a sample listing reference." />
            </div>
          </div>
          <div className="request-form-footer">
            <p className="privacy-note">Please do not include payment details or unnecessary personal information. This front-end demo keeps your request in local page state only.</p>
            <button type="submit" className="button-primary">Prepare Part Request <Icon name="arrow" className="h-4 w-4" /></button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DeliveryRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({ zip: "", part: "", option: "", date: "", name: "", phone: "", email: "" });
  const formId = useId();
  const update = (key: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!values.zip.trim() || !/^\d{5}(?:-\d{4})?$/.test(values.zip.trim())) next.zip = "Enter a valid ZIP code.";
    if (!values.part.trim()) next.part = "Tell us which part you are interested in.";
    if (!values.option) next.option = "Choose delivery or pickup.";
    if (!values.name.trim()) next.name = "Enter your name.";
    if (!values.phone.trim() || values.phone.replace(/\D/g, "").length < 7) next.phone = "Enter a valid phone number.";
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email address or leave this field blank.";
    setErrors(next);
    if (!Object.keys(next).length) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="success-panel" role="status" aria-live="polite">
        <span className="success-icon"><Icon name="check" className="h-7 w-7" /></span>
        <h3>Delivery request prepared.</h3>
        <p>Thanks! Your request has been prepared. Please contact Asante Used Auto Parts to confirm delivery availability and final pricing.</p>
        <div className="request-summary">
          <strong>Request summary</strong>
          <span>{values.option} · ZIP {values.zip} · {values.part}</span>
          <span>Contact: {values.name} · {values.phone}</span>
          {values.date && <span>Preferred date: {values.date}</span>}
        </div>
        <button type="button" className="button-light" onClick={() => { setSubmitted(false); setValues({ zip: "", part: "", option: "", date: "", name: "", phone: "", email: "" }); }}>Prepare another request</button>
      </div>
    );
  }

  const errorProps = (key: string) => ({
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${formId}-${key}-error` : undefined,
  });
  const errorText = (key: string) => errors[key] && <p className="form-error" id={`${formId}-${key}-error`}>{errors[key]}</p>;

  return (
    <div className="delivery-form-body">
      <p className="section-copy" style={{ margin: "0 0 20px", fontSize: "0.8rem" }}>Share a few details so the team can confirm delivery or pickup options for your request.</p>
      <form onSubmit={submit} noValidate>
        <div className="request-fields-grid">
          <div className="form-field">
            <label className="form-label" htmlFor={`${formId}-zip`}>ZIP code <span className="required">*</span></label>
            <input id={`${formId}-zip`} className="control" inputMode="numeric" autoComplete="postal-code" value={values.zip} onChange={(event) => update("zip", event.target.value)} placeholder="e.g. 17401" {...errorProps("zip")} />
            {errorText("zip")}
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor={`${formId}-part`}>Part needed <span className="required">*</span></label>
            <input id={`${formId}-part`} className="control" value={values.part} onChange={(event) => update("part", event.target.value)} placeholder="Engine, transmission, or other" {...errorProps("part")} />
            {errorText("part")}
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor={`${formId}-option`}>Delivery or pickup <span className="required">*</span></label>
            <select id={`${formId}-option`} className="control" value={values.option} onChange={(event) => update("option", event.target.value)} {...errorProps("option")}>
              <option value="">Choose one</option><option>Delivery</option><option>Pickup</option>
            </select>
            {errorText("option")}
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor={`${formId}-date`}>Preferred date <span className="field-hint">Optional</span></label>
            <input id={`${formId}-date`} className="control" type="date" value={values.date} onChange={(event) => update("date", event.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor={`${formId}-name`}>Contact name <span className="required">*</span></label>
            <input id={`${formId}-name`} className="control" autoComplete="name" value={values.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name" {...errorProps("name")} />
            {errorText("name")}
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor={`${formId}-phone`}>Phone number <span className="required">*</span></label>
            <input id={`${formId}-phone`} className="control" type="tel" autoComplete="tel" value={values.phone} onChange={(event) => update("phone", event.target.value)} placeholder="(717) 555-0123" {...errorProps("phone")} />
            {errorText("phone")}
          </div>
          <div className="form-field field-span-2">
            <label className="form-label" htmlFor={`${formId}-email`}>Email address <span className="field-hint">Optional</span></label>
            <input id={`${formId}-email`} className="control" type="email" autoComplete="email" value={values.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" {...errorProps("email")} />
            {errorText("email")}
          </div>
        </div>
        <button type="submit" className="button-primary">Check Options <Icon name="arrow" className="h-4 w-4" /></button>
      </form>
    </div>
  );
}

export function GeneralInquiryForm() {
  const [values, setValues] = useState({ name: "", phone: "", email: "", message: "", contact: "Phone call" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const formId = useId();
  const update = (key: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.phone.trim() || values.phone.replace(/\D/g, "").length < 7) next.phone = "Please enter a valid phone number.";
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.message.trim()) next.message = "Tell us a little about your question.";
    setErrors(next);
    if (!Object.keys(next).length) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="contact-local-success" role="status" aria-live="polite">
        Your inquiry is prepared locally for this demonstration. To reach the team, please call 717-812-1080 or 223-260-6661.
        <button type="button" className="button-text" style={{ color: "#86d0ff", marginTop: 6 }} onClick={() => { setSubmitted(false); setValues({ name: "", phone: "", email: "", message: "", contact: "Phone call" }); }}>
          Prepare another inquiry
        </button>
      </div>
    );
  }

  const errorProps = (key: string) => ({
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${formId}-${key}-error` : undefined,
  });
  const errorText = (key: string) => errors[key] && <p className="form-error" id={`${formId}-${key}-error`}>{errors[key]}</p>;

  return (
    <form onSubmit={submit} noValidate>
      <div className="form-field">
        <label className="form-label" htmlFor={`${formId}-name`}>Full name <span className="required">*</span></label>
        <input id={`${formId}-name`} className="control" autoComplete="name" value={values.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name" {...errorProps("name")} />
        {errorText("name")}
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor={`${formId}-phone`}>Phone number <span className="required">*</span></label>
        <input id={`${formId}-phone`} className="control" type="tel" autoComplete="tel" value={values.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Your best contact number" {...errorProps("phone")} />
        {errorText("phone")}
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor={`${formId}-email`}>Email address <span className="field-hint">Optional</span></label>
        <input id={`${formId}-email`} className="control" type="email" autoComplete="email" value={values.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" {...errorProps("email")} />
        {errorText("email")}
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor={`${formId}-contact`}>Preferred contact</label>
        <select id={`${formId}-contact`} className="control" value={values.contact} onChange={(event) => update("contact", event.target.value)}>
          <option>Phone call</option><option>Text message</option><option>Email</option>
        </select>
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor={`${formId}-message`}>How can we help? <span className="required">*</span></label>
        <textarea id={`${formId}-message`} className="control textarea-control" value={values.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell us what you're looking for" {...errorProps("message")} />
        {errorText("message")}
      </div>
      <button type="submit" className="button-primary">Prepare Inquiry <Icon name="arrow" className="h-4 w-4" /></button>
    </form>
  );
}

export function ProductDetails({
  product,
  onRequest,
}: {
  product: Product;
  onRequest: (product: Product) => void;
}) {
  return (
    <div className="product-modal-body">
      <div className="product-modal-image">
        <img
          src={product.image}
          alt={product.imageAlt}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = product.category === "Engine" ? "/images/asante-hero.jpg" : "/images/transmission-assembly.jpg";
          }}
        />
      </div>
      <div className="product-modal-content">
        <span className="modal-category">{product.category} · Demonstration listing</span>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <dl className="product-spec-list">
          <div className="product-spec-row"><dt>Example vehicle</dt><dd>{product.make} {product.model}</dd></div>
          <div className="product-spec-row"><dt>Model years</dt><dd>{product.years}</dd></div>
          <div className="product-spec-row"><dt>Application detail</dt><dd>{product.engineSize}</dd></div>
          <div className="product-spec-row"><dt>Sample reference</dt><dd>{product.sampleRef} · demo only</dd></div>
          {product.transmissionType && <div className="product-spec-row"><dt>Transmission</dt><dd>{product.transmissionType}</dd></div>}
          {product.drivetrain && <div className="product-spec-row"><dt>Drivetrain example</dt><dd>{product.drivetrain}</dd></div>}
          <div className="product-spec-row"><dt>Sample price</dt><dd>${product.price.toLocaleString("en-US")} · confirm</dd></div>
        </dl>
        <div className="modal-disclaimer">Demonstration details only. Availability, compatibility, condition, warranty, and final pricing must be confirmed with Asante Used Auto Parts.</div>
        <button type="button" className="button-primary" onClick={() => onRequest(product)}>
          Request This Part <Icon name="arrow" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export const sampleProducts = products;