import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent } from "react";
import {
  brands,
  faqs,
  products,
  vehicleModels,
  years,
  type Product,
} from "./data";
import {
  BrandLogo,
  DeliveryRequestForm,
  GeneralInquiryForm,
  Icon,
  ModalShell,
  ProductCard,
  ProductDetails,
  RequestForm,
  type RequestValues,
} from "./components";

type FinderValues = {
  year: string;
  make: string;
  model: string;
  category: string;
  details: string;
  zip: string;
};

type EngineFilters = {
  make: string;
  year: string;
  model: string;
  size: string;
};

type TransmissionFilters = {
  make: string;
  year: string;
  model: string;
  detail: string;
};

const navItems = [
  { label: "Home", id: "home" },
  { label: "Engines", id: "engines" },
  { label: "Transmissions", id: "transmissions" },
  { label: "Brands", id: "brands" },
  { label: "Delivery & Warranty", id: "delivery" },
  { label: "Contact", id: "contact" },
];

const trustItems = [
  {
    label: "Tested & Inspected Parts",
    icon: "check-circle" as const,
    detail: "Our advertisement describes engines as tested and transmissions as inspected. Ask for the condition details of the specific part.",
  },
  {
    label: "30-Day Warranty Advertised",
    icon: "shield" as const,
    detail: "The supplied advertisement states a 30-day warranty on parts. Confirm written coverage, exclusions, and terms before purchase.",
  },
  {
    label: "Pickup & Delivery Options",
    icon: "truck" as const,
    detail: "Pickup and delivery are advertised options. Coverage, timing, and final cost depend on your location and order.",
  },
  {
    label: "24/7 Contact Availability Advertised",
    icon: "clock" as const,
    detail: "The advertisement promotes 24/7 contact availability. Response time and availability should be confirmed with the business.",
  },
];

const initialFinder: FinderValues = {
  year: "",
  make: "",
  model: "",
  category: "",
  details: "",
  zip: "",
};

function SectionHeading({
  kicker,
  title,
  copy,
  className = "",
}: {
  kicker: string;
  title: string;
  copy?: string;
  className?: string;
}) {
  return (
    <div className={`section-heading ${className}`}>
      <span className="section-kicker">{kicker}</span>
      <h2 className="section-title">{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </div>
  );
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTrust, setActiveTrust] = useState<number | null>(null);
  const [finder, setFinder] = useState<FinderValues>(initialFinder);
  const [finderError, setFinderError] = useState("");
  const [finderResults, setFinderResults] = useState<Product[] | null>(null);
  const [finderLoading, setFinderLoading] = useState(false);
  const [inventoryCategory, setInventoryCategory] = useState("All Parts");
  const [sortOrder, setSortOrder] = useState("featured");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [quotePrefill, setQuotePrefill] = useState<Partial<RequestValues> | null>(null);
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [engineFilters, setEngineFilters] = useState<EngineFilters>({ make: "", year: "", model: "", size: "" });
  const [transmissionFilters, setTransmissionFilters] = useState<TransmissionFilters>({ make: "", year: "", model: "", detail: "" });
  const finderTimer = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => () => {
    if (finderTimer.current !== null) window.clearTimeout(finderTimer.current);
  }, []);

  useEffect(() => {
    const sectionNodes = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    if (!sectionNodes.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-31% 0px -58% 0px", threshold: 0 },
    );
    sectionNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -36px 0px" },
    );
    revealNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollTo(id);
  };

  const updateFinder = (key: keyof FinderValues, value: string) => {
    if (finderTimer.current !== null) {
      window.clearTimeout(finderTimer.current);
      finderTimer.current = null;
      setFinderLoading(false);
    }
    setFinder((current) => ({
      ...current,
      [key]: value,
      ...(key === "make" ? { model: "" } : {}),
    }));
    setFinderError("");
    setFinderResults(null);
  };

  const submitFinder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!finder.year || !finder.make || !finder.model || !finder.category) {
      setFinderError("Please select a year, make, model, and part category to search.");
      setFinderResults(null);
      return;
    }
    setFinderError("");
    setFinderLoading(true);
    setFinderResults(null);
    if (finderTimer.current !== null) window.clearTimeout(finderTimer.current);
    const currentCriteria = { ...finder };
    finderTimer.current = window.setTimeout(() => {
      const matching = products.filter((product) => {
        const year = Number(currentCriteria.year);
        return (
          product.make === currentCriteria.make &&
          product.model === currentCriteria.model &&
          product.category === currentCriteria.category &&
          year >= product.yearStart &&
          year <= product.yearEnd
        );
      });
      setFinderResults(matching);
      setFinderLoading(false);
      finderTimer.current = null;
      window.requestAnimationFrame(() => {
        document.getElementById("finder-result")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }, 360);
  };

  const resetFinder = () => {
    if (finderTimer.current !== null) {
      window.clearTimeout(finderTimer.current);
      finderTimer.current = null;
    }
    setFinder(initialFinder);
    setFinderError("");
    setFinderResults(null);
    setFinderLoading(false);
  };

  const openQuote = (prefill: Partial<RequestValues> = {}) => {
    setDetailProduct(null);
    setQuotePrefill({ contactMethod: "Phone call", ...prefill });
  };

  const requestProduct = (product: Product) => {
    openQuote({
      category: product.category,
      make: product.make,
      model: product.model,
      engineDetails: product.engineSize,
      details: `Interested in demonstration listing ${product.sampleRef}: ${product.title}. Please confirm fitment, condition, and current availability.`,
    });
  };

  const filterBrand = (brand: string) => {
    if (finderTimer.current !== null) {
      window.clearTimeout(finderTimer.current);
      finderTimer.current = null;
    }
    setFinderLoading(false);
    setSelectedBrand(brand);
    setInventoryCategory("All Parts");
    setFinder((current) => ({ ...current, make: brand, model: "" }));
    setFinderResults(null);
    setFinderError("");
    scrollTo("inventory");
  };

  const visibleInventory = useMemo(() => {
    const visible = products.filter((product) => {
      const categoryMatches = inventoryCategory === "All Parts" || product.category === inventoryCategory.replace(/s$/, "");
      const brandMatches = !selectedBrand || product.make === selectedBrand;
      return categoryMatches && brandMatches;
    });
    if (sortOrder === "price-low") return [...visible].sort((a, b) => a.price - b.price);
    if (sortOrder === "price-high") return [...visible].sort((a, b) => b.price - a.price);
    return visible;
  }, [inventoryCategory, selectedBrand, sortOrder]);

  const engineListings = useMemo(() => {
    return products.filter((product) => {
      if (product.category !== "Engine") return false;
      if (engineFilters.make && product.make !== engineFilters.make) return false;
      if (engineFilters.model && product.model !== engineFilters.model) return false;
      if (engineFilters.year) {
        const year = Number(engineFilters.year);
        if (year < product.yearStart || year > product.yearEnd) return false;
      }
      if (engineFilters.size && !product.engineSize.toLowerCase().includes(engineFilters.size.toLowerCase())) return false;
      return true;
    });
  }, [engineFilters]);

  const transmissionListings = useMemo(() => {
    return products.filter((product) => {
      if (product.category !== "Transmission") return false;
      if (transmissionFilters.make && product.make !== transmissionFilters.make) return false;
      if (transmissionFilters.model && product.model !== transmissionFilters.model) return false;
      if (transmissionFilters.year) {
        const year = Number(transmissionFilters.year);
        if (year < product.yearStart || year > product.yearEnd) return false;
      }
      if (transmissionFilters.detail === "Automatic" && product.transmissionType !== "Automatic") return false;
      if (transmissionFilters.detail === "Manual" && product.transmissionType !== "Manual") return false;
      if (transmissionFilters.detail === "2-wheel drive" && !product.drivetrain?.toLowerCase().includes("front")) return false;
      if (transmissionFilters.detail === "4-wheel drive" && !product.drivetrain?.toLowerCase().includes("4-wheel")) return false;
      return true;
    });
  }, [transmissionFilters]);

  const finderPrefill: Partial<RequestValues> = {
    year: finder.year,
    make: finder.make,
    model: finder.model,
    category: finder.category,
    engineDetails: finder.details,
    zip: finder.zip,
    details: `Looking for a ${finder.category.toLowerCase()} for a ${finder.year} ${finder.make} ${finder.model}. Please confirm compatibility and availability.`,
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        <div className="container-shell header-inner">
          <BrandLogo />
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link${activeSection === item.id ? " active" : ""}`}
                aria-current={activeSection === item.id ? "location" : undefined}
                onClick={(event) => handleNavClick(event, item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="header-phone" href="tel:+17178121080" aria-label="Call Asante Used Auto Parts at 717-812-1080">
              <Icon name="phone" className="h-4 w-4" />
              <span>Call Us · 717-812-1080</span>
            </a>
            <button className="button-primary header-cta" type="button" onClick={() => scrollTo("find-parts")}>
              Find a Part <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
        <nav id="mobile-navigation" className={`mobile-nav${mobileMenuOpen ? " open" : ""}`} aria-label="Mobile navigation" aria-hidden={!mobileMenuOpen}>
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={(event) => handleNavClick(event, item.id)}>
                {item.label}<Icon name="arrow-up-right" className="h-4 w-4" />
              </a>
            ))}
            <a className="mobile-phone-link" href="tel:+17178121080" onClick={() => setMobileMenuOpen(false)}>
              <span>Call Us · 717-812-1080</span><Icon name="phone" className="h-4 w-4" />
            </a>
            <a className="mobile-phone-link" href="tel:+12232606661" onClick={() => setMobileMenuOpen(false)}>
              <span>223-260-6661</span><Icon name="phone" className="h-4 w-4" />
            </a>
        </nav>
      </header>

      <main>
        <section
          id="home"
          className="hero section-anchor"
          style={{ backgroundImage: "url('/images/asante-hero.jpg')" }}
          aria-labelledby="hero-title"
        >
          <div className="container-shell hero-content">
            <div className="hero-copy">
              <BrandLogo hero />
              <div className="hero-eyebrow">Quality used auto parts</div>
              <h1 id="hero-title" className="hero-title">
                The Right Parts.<br />The Right Price.<br /><span>Back on the Road.</span>
              </h1>
              <p className="hero-description">
                Shop quality used engines and transmissions for your vehicle. Get help finding the right fit, with convenient pickup and delivery options across our service areas.
              </p>
              <div className="hero-actions">
                <button className="button-primary" type="button" onClick={() => scrollTo("find-parts")}>
                  Find Your Part <Icon name="arrow" className="h-4 w-4" />
                </button>
                <button className="button-secondary" type="button" onClick={() => openQuote()}>
                  Request a Quote <Icon name="arrow-up-right" className="h-4 w-4" />
                </button>
              </div>
              <div className="hero-trust" aria-label="Service information">
                {trustItems.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    className="trust-button"
                    title={item.detail}
                    aria-expanded={activeTrust === index}
                    aria-describedby={activeTrust === index ? "trust-detail" : undefined}
                    onMouseEnter={() => setActiveTrust(index)}
                    onFocus={() => setActiveTrust(index)}
                    onClick={() => setActiveTrust((current) => current === index ? null : index)}
                  >
                    <Icon name={item.icon} className="h-4 w-4" />{item.label}
                  </button>
                ))}
              </div>
              {activeTrust !== null && (
                <p id="trust-detail" className="trust-detail" aria-live="polite">{trustItems[activeTrust].detail}</p>
              )}
            </div>
          </div>
          <a className="hero-scroll" href="#find-parts" aria-label="Scroll to the vehicle part finder" onClick={(event) => handleNavClick(event, "find-parts")}>
            Scroll to find your part
          </a>
        </section>

        <section id="find-parts" className="finder-section section-pad section-anchor">
          <div className="container-shell reveal">
            <SectionHeading
              kicker="Start with your vehicle"
              title="Find the Right Part for Your Vehicle"
              copy="Tell us what you drive and what you need. We’ll help you identify the right replacement part."
            />

            <div className="finder-panel">
              <div className="finder-panel-head">
                <div>
                  <h3>Tell us what you drive</h3>
                  <p>Choose your vehicle details to explore a small set of sample listings. A team member can help confirm a suitable match.</p>
                </div>
                <span className="finder-mark"><Icon name="search" className="h-7 w-7" /></span>
              </div>
              <form onSubmit={submitFinder} noValidate>
                <div className="finder-grid">
                  <div className="form-field">
                    <label className="form-label" htmlFor="finder-year">Vehicle year <span className="required">*</span></label>
                    <select id="finder-year" className="control" value={finder.year} onChange={(event) => updateFinder("year", event.target.value)} aria-required="true">
                      <option value="">Select year</option>
                      {years.map((year) => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="finder-make">Vehicle make <span className="required">*</span></label>
                    <select id="finder-make" className="control" value={finder.make} onChange={(event) => updateFinder("make", event.target.value)} aria-required="true">
                      <option value="">Select make</option>
                      {[...brands, "Honda", "Chevrolet", "Nissan"].map((make) => <option key={make} value={make}>{make}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="finder-model">Vehicle model <span className="required">*</span></label>
                    <select id="finder-model" className="control" value={finder.model} onChange={(event) => updateFinder("model", event.target.value)} disabled={!finder.make} aria-required="true">
                      <option value="">{finder.make ? "Select model" : "Choose a make first"}</option>
                      {(vehicleModels[finder.make] ?? []).map((model) => <option key={model} value={model}>{model}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="finder-category">Part category <span className="required">*</span></label>
                    <select id="finder-category" className="control" value={finder.category} onChange={(event) => updateFinder("category", event.target.value)} aria-required="true">
                      <option value="">Select part</option>
                      <option value="Engine">Engine</option>
                      <option value="Transmission">Transmission</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="finder-details">Engine size, part number, or details</label>
                    <input id="finder-details" className="control" value={finder.details} onChange={(event) => updateFinder("details", event.target.value)} placeholder="Optional details" />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="finder-zip">ZIP code</label>
                    <input id="finder-zip" className="control" inputMode="numeric" autoComplete="postal-code" value={finder.zip} onChange={(event) => updateFinder("zip", event.target.value)} placeholder="Optional" />
                  </div>
                </div>
                {finderError && <p className="finder-error" role="alert">{finderError}</p>}
                <div className="finder-actions">
                  <button className="button-primary" type="submit" disabled={finderLoading}>
                    {finderLoading ? <>Searching <span className="loading-dots" aria-hidden="true"><span /><span /><span /></span></> : <>Find Available Parts <Icon name="arrow" className="h-4 w-4" /></>}
                  </button>
                  <button className="finder-reset" type="button" onClick={resetFinder}>Reset search</button>
                </div>
                <p className="finder-hint">Vehicle year, make, model, and part category are required. Search results use local demonstration data only.</p>
              </form>
            </div>

            <div id="finder-result" aria-live="polite">
              {finderLoading && (
                <div className="finder-results" role="status"><p className="section-copy">Checking the sample listings <span className="loading-dots" aria-hidden="true"><span /><span /><span /></span></p></div>
              )}
              {finderResults && (
                <div className="finder-results">
                  <div className="finder-results-head">
                    <div>
                      <h3>{finderResults.length ? "Sample listings to explore" : "No matching sample listings"}</h3>
                      <p>{finder.year} {finder.make} {finder.model} · {finder.category}</p>
                    </div>
                    <button type="button" className="button-text" onClick={resetFinder}>Edit criteria <Icon name="arrow" className="h-4 w-4" /></button>
                  </div>
                  {finderResults.length ? (
                    <div className="product-grid">
                      {finderResults.map((product) => <ProductCard key={product.id} product={product} onDetails={setDetailProduct} onRequest={requestProduct} />)}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <h3>Looking for a specific part?</h3>
                      <p>We don’t have a matching demonstration listing for those exact details. Contact the team to ask about availability; this result does not reflect live inventory.</p>
                      <button type="button" className="button-primary" onClick={() => openQuote(finderPrefill)}>Request This Part <Icon name="arrow" className="h-4 w-4" /></button>
                    </div>
                  )}
                  <p className="finder-disclaimer">Displayed parts are demonstration listings. Final availability, vehicle compatibility, condition, warranty, and pricing must be confirmed by Asante Used Auto Parts.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="inventory" className="inventory-section section-pad section-anchor">
          <div className="container-shell reveal">
            <div className="inventory-topline">
              <SectionHeading
                kicker="Featured inventory"
                title="Quality Used Parts. Ready for Their Next Journey."
                copy="Explore our featured engine and transmission categories, then contact us to confirm availability for your vehicle."
              />
              <div className="inventory-controls" aria-label="Filter and sort demonstration listings">
                <div className="category-switch" role="group" aria-label="Filter by part category">
                  {["All Parts", "Engines", "Transmissions"].map((category) => (
                    <button key={category} type="button" aria-pressed={inventoryCategory === category} onClick={() => setInventoryCategory(category)}>{category}</button>
                  ))}
                </div>
                <label className="sr-only" htmlFor="sort-products">Sort sample listings</label>
                <select id="sort-products" className="control sort-control" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Sample price: low to high</option>
                  <option value="price-high">Sample price: high to low</option>
                </select>
              </div>
            </div>
            {selectedBrand && (
              <div className="active-filter-note" role="status">
                Showing sample listings for <strong>{selectedBrand}</strong>
                <button className="clear-filter" type="button" onClick={() => setSelectedBrand(null)}>Clear brand filter</button>
              </div>
            )}
            <div className="product-grid">
              {visibleInventory.length ? visibleInventory.map((product) => (
                <ProductCard key={product.id} product={product} onDetails={setDetailProduct} onRequest={requestProduct} />
              )) : (
                <div className="empty-state">
                  <h3>No matching demonstration listings</h3>
                  <p>Sample inventory is limited and does not represent live stock. Looking for a {selectedBrand ?? "specific"} part? Contact us and we’ll help you check availability.</p>
                  <button type="button" className="button-primary" onClick={() => openQuote({ make: selectedBrand ?? "", category: inventoryCategory === "Transmissions" ? "Transmission" : inventoryCategory === "Engines" ? "Engine" : "" })}>
                    Request a Part <Icon name="arrow" className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="inventory-disclaimer">Advertised price ranges: engines $800–$1,500; transmissions $500–$1,200. Product card prices are sample prices, not confirmed quotes. Delivery is advertised at $100. Confirm individual availability, fitment, condition, warranty, and pricing.</p>
          </div>
        </section>

        <section
          id="engines"
          className="category-hero section-anchor"
          style={{ backgroundImage: "url('/images/asante-hero.jpg')" }}
          aria-labelledby="engines-title"
        >
          <div className="container-shell category-hero-content reveal">
            <div>
              <span className="section-kicker">Used engine options</span>
              <h2 id="engines-title" className="section-title">Find a Replacement Engine With Confidence.</h2>
              <p className="section-copy">Explore used engine options and contact our team to confirm the correct replacement for your vehicle.</p>
              <div className="category-hero-actions">
                <button type="button" className="button-primary" onClick={() => openQuote({ category: "Engine" })}>Help Me Find an Engine <Icon name="arrow" className="h-4 w-4" /></button>
                <span className="category-range">Advertised engine range<strong>$800–$1,500</strong></span>
              </div>
            </div>
          </div>
        </section>

        <section className="category-details-section section-pad">
          <div className="container-shell reveal">
            <div className="category-details-head">
              <SectionHeading kicker="Engine listings" title="Start With the Details That Matter" copy="Filter the demonstration listings by make, year, model, or engine size. Confirm any potential match with the team." />
              <button type="button" className="button-text" onClick={() => openQuote({ category: "Engine" })}>Request an engine <Icon name="arrow" className="h-4 w-4" /></button>
            </div>
            <div className="category-filter-panel">
              <div className="form-field">
                <label className="form-label" htmlFor="engine-make">Vehicle make</label>
                <select id="engine-make" className="control" value={engineFilters.make} onChange={(event) => setEngineFilters((current) => ({ ...current, make: event.target.value, model: "" }))}>
                  <option value="">All sample makes</option>
                  {[...brands, "Honda", "Chevrolet", "Nissan"].map((make) => <option key={make} value={make}>{make}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="engine-year">Vehicle year</label>
                <select id="engine-year" className="control" value={engineFilters.year} onChange={(event) => setEngineFilters((current) => ({ ...current, year: event.target.value }))}>
                  <option value="">All years</option>
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="engine-model">Vehicle model</label>
                <select id="engine-model" className="control" value={engineFilters.model} disabled={!engineFilters.make} onChange={(event) => setEngineFilters((current) => ({ ...current, model: event.target.value }))}>
                  <option value="">{engineFilters.make ? "All models" : "Choose make first"}</option>
                  {(vehicleModels[engineFilters.make] ?? []).map((model) => <option key={model} value={model}>{model}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="engine-size">Engine size</label>
                <input id="engine-size" className="control" value={engineFilters.size} onChange={(event) => setEngineFilters((current) => ({ ...current, size: event.target.value }))} placeholder="Optional" />
              </div>
              <button type="button" className="button-primary" onClick={() => openQuote({ category: "Engine", make: engineFilters.make, model: engineFilters.model, year: engineFilters.year, engineDetails: engineFilters.size })}>Request an Engine <Icon name="arrow" className="h-4 w-4" /></button>
            </div>
            <div className="category-product-grid">
              {engineListings.length ? engineListings.map((product) => <ProductCard key={product.id} product={product} onDetails={setDetailProduct} onRequest={requestProduct} />) : (
                <div className="empty-state">
                  <h3>No matching engine examples</h3>
                  <p>These are limited demonstration listings, not live inventory. Share your vehicle details and ask the team to check availability.</p>
                  <button type="button" className="button-light" onClick={() => openQuote({ category: "Engine", make: engineFilters.make, model: engineFilters.model, year: engineFilters.year })}>Help me find an engine</button>
                </div>
              )}
            </div>
            <div className="category-info-strip" id="engine-info">
              <div className="category-info-item">
                <span className="category-info-icon"><Icon name="car" /></span>
                <div><strong>What we need to find your engine</strong><p>Vehicle year, make, model, and engine size help narrow down a suitable application.</p></div>
              </div>
              <div className="category-info-item">
                <span className="category-info-icon"><Icon name="clipboard" /></span>
                <div><strong>Share helpful details</strong><p>A VIN can be useful but is optional. Existing engine codes or part details can help too.</p></div>
              </div>
              <div className="category-info-item">
                <span className="category-info-icon"><Icon name="shield" /></span>
                <div><strong>Ask before you buy</strong><p>Confirm compatibility, engine condition, testing information, warranty terms, and final price.</p></div>
              </div>
            </div>
            <p className="inventory-disclaimer">Do not rely on a generic listing to confirm fitment. All engine applications, availability, pricing, and warranty details require confirmation.</p>
          </div>
        </section>

        <section
          id="transmissions"
          className="category-hero section-anchor"
          style={{ backgroundImage: "url('/images/transmission-assembly.jpg')" }}
          aria-labelledby="transmissions-title"
        >
          <div className="container-shell category-hero-content reveal">
            <div>
              <span className="section-kicker">Used transmission options</span>
              <h2 id="transmissions-title" className="section-title">The Right Transmission Starts With the Right Match.</h2>
              <p className="section-copy">Find a replacement transmission for your vehicle and confirm compatibility before purchase.</p>
              <div className="category-hero-actions">
                <button type="button" className="button-primary" onClick={() => openQuote({ category: "Transmission" })}>Find My Transmission <Icon name="arrow" className="h-4 w-4" /></button>
                <span className="category-range">Advertised transmission range<strong>$500–$1,200</strong></span>
              </div>
            </div>
          </div>
        </section>

        <section className="category-details-section section-pad">
          <div className="container-shell reveal">
            <div className="category-details-head">
              <SectionHeading kicker="Transmission listings" title="Match the Configuration, Not Just the Model" copy="Browse sample transmission assemblies and filter by vehicle details. Exact fitment may depend on engine, drivetrain, and transmission code." />
              <button type="button" className="button-text" onClick={() => openQuote({ category: "Transmission" })}>Request a transmission <Icon name="arrow" className="h-4 w-4" /></button>
            </div>
            <div className="category-filter-panel">
              <div className="form-field">
                <label className="form-label" htmlFor="transmission-make">Vehicle make</label>
                <select id="transmission-make" className="control" value={transmissionFilters.make} onChange={(event) => setTransmissionFilters((current) => ({ ...current, make: event.target.value, model: "" }))}>
                  <option value="">All sample makes</option>
                  {[...brands, "Honda", "Chevrolet", "Nissan"].map((make) => <option key={make} value={make}>{make}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="transmission-year">Vehicle year</label>
                <select id="transmission-year" className="control" value={transmissionFilters.year} onChange={(event) => setTransmissionFilters((current) => ({ ...current, year: event.target.value }))}>
                  <option value="">All years</option>
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="transmission-model">Vehicle model</label>
                <select id="transmission-model" className="control" value={transmissionFilters.model} disabled={!transmissionFilters.make} onChange={(event) => setTransmissionFilters((current) => ({ ...current, model: event.target.value }))}>
                  <option value="">{transmissionFilters.make ? "All models" : "Choose make first"}</option>
                  {(vehicleModels[transmissionFilters.make] ?? []).map((model) => <option key={model} value={model}>{model}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="transmission-detail">Type or drivetrain</label>
                <select id="transmission-detail" className="control" value={transmissionFilters.detail} onChange={(event) => setTransmissionFilters((current) => ({ ...current, detail: event.target.value }))}>
                  <option value="">Any configuration</option>
                  <option>Automatic</option>
                  <option>Manual</option>
                  <option>2-wheel drive</option>
                  <option>4-wheel drive</option>
                </select>
              </div>
              <button type="button" className="button-primary" onClick={() => openQuote({ category: "Transmission", make: transmissionFilters.make, model: transmissionFilters.model, year: transmissionFilters.year, details: transmissionFilters.detail ? `Transmission detail: ${transmissionFilters.detail}` : "" })}>Request a Match <Icon name="arrow" className="h-4 w-4" /></button>
            </div>
            <div className="category-product-grid">
              {transmissionListings.length ? transmissionListings.map((product) => <ProductCard key={product.id} product={product} onDetails={setDetailProduct} onRequest={requestProduct} />) : (
                <div className="empty-state">
                  <h3>No matching transmission examples</h3>
                  <p>Sample listings are limited. Contact the team with your year, make, model, engine, drivetrain, and transmission code to check availability.</p>
                  <button type="button" className="button-light" onClick={() => openQuote({ category: "Transmission", make: transmissionFilters.make, model: transmissionFilters.model, year: transmissionFilters.year })}>Find my transmission</button>
                </div>
              )}
            </div>
            <div className="category-info-strip">
              <div className="category-info-item">
                <span className="category-info-icon"><Icon name="transmission" /></span>
                <div><strong>Configuration matters</strong><p>Compatibility may depend on engine, drivetrain, transmission type, and the transmission code.</p></div>
              </div>
              <div className="category-info-item">
                <span className="category-info-icon"><Icon name="wrench" /></span>
                <div><strong>Ask about inspection</strong><p>Transmissions are advertised as inspected. Ask about the specific unit’s condition and inspection details.</p></div>
              </div>
              <div className="category-info-item">
                <span className="category-info-icon"><Icon name="shield" /></span>
                <div><strong>Confirm terms</strong><p>The advertisement states a 30-day parts warranty. Request the written terms and exclusions.</p></div>
              </div>
            </div>
            <p className="inventory-disclaimer">Transmission listings are demonstration examples only. Confirm compatibility, availability, inspection details, written warranty, and price before purchase.</p>
          </div>
        </section>

        <section id="brands" className="brand-section section-pad section-anchor">
          <div className="container-shell reveal">
            <SectionHeading
              kicker="Vehicle makes"
              title="Parts for the Vehicles You Drive."
              copy="Choose a make to filter our demonstration listings. Availability varies, so ask us about the part and configuration you need."
            />
            <div className="brand-grid">
              {brands.map((brand) => (
                <button key={brand} type="button" className={`brand-tile${selectedBrand === brand ? " selected" : ""}`} onClick={() => filterBrand(brand)} aria-pressed={selectedBrand === brand}>
                  <strong>{brand}</strong><Icon name="arrow-up-right" className="h-4 w-4" />
                </button>
              ))}
            </div>
            <p className="brands-note">Demonstration listings do not represent a complete inventory. Looking for a specific part? Contact us and we’ll help you check availability.</p>
          </div>
        </section>

        <section id="why-asante" className="benefits-section section-pad section-anchor">
          <div className="container-shell reveal">
            <SectionHeading
              kicker="A more helpful parts search"
              title="Quality Parts. Honest Answers. Convenient Service."
              copy="A replacement part is a big decision. Get clear answers about the specific part, vehicle match, and options before you move forward."
            />
            <div className="benefits-grid">
              <article className="benefit-item">
                <span className="benefit-icon"><Icon name="check-circle" className="h-5 w-5" /></span>
                <h3>Tested & Inspected</h3>
                <p>Parts are advertised as tested or inspected. Ask us for condition and testing details for the specific part you need.</p>
              </article>
              <article className="benefit-item">
                <span className="benefit-icon"><Icon name="shield" className="h-5 w-5" /></span>
                <h3>Warranty Information</h3>
                <p>The supplied advertisement states a 30-day warranty on parts. Confirm the exact coverage, exclusions, and terms before purchase.</p>
              </article>
              <article className="benefit-item">
                <span className="benefit-icon"><Icon name="package" className="h-5 w-5" /></span>
                <h3>Affordable Replacement Options</h3>
                <p>Explore advertised used-part price ranges as an alternative to purchasing a new replacement component.</p>
              </article>
              <article className="benefit-item">
                <span className="benefit-icon"><Icon name="truck" className="h-5 w-5" /></span>
                <h3>Delivery & Pickup</h3>
                <p>Ask about delivery and pickup options across our listed service areas. Installation availability is also advertised.</p>
              </article>
            </div>
            <div className="benefits-cta">
              <p>Have a question about a specific replacement part?</p>
              <button type="button" className="button-secondary" onClick={() => scrollTo("contact")}>Talk to Our Team <Icon name="arrow" className="h-4 w-4" /></button>
            </div>
          </div>
        </section>

        <section id="delivery" className="delivery-section section-pad section-anchor">
          <div className="container-shell delivery-layout reveal">
            <div className="delivery-copy">
              <SectionHeading
                kicker="Pickup & delivery"
                title="Parts Delivered Where You Need Them."
                copy="Convenient delivery and pickup options for customers across our advertised service areas."
              />
              <div className="delivery-options">
                <div className="delivery-option"><Icon name="pin" className="h-5 w-5" /><span><strong>Advertised service areas:</strong> Maryland, Virginia, New York, New Jersey, and Delaware.</span></div>
                <div className="delivery-option"><Icon name="truck" className="h-5 w-5" /><span><strong>$100 delivery is advertised.</strong> Same-day delivery, pickup, and installation are also mentioned in the supplied advertisement.</span></div>
                <div className="delivery-option"><Icon name="clock" className="h-5 w-5" /><span>Timing and availability vary by location, order, and arrangements confirmed with the team.</span></div>
              </div>
              <button type="button" className="button-primary" onClick={() => setDeliveryModalOpen(true)}>Check Delivery Options <Icon name="arrow" className="h-4 w-4" /></button>
              <p className="delivery-disclaimer">Delivery timing, coverage, pricing, pickup arrangements, and installation availability must be confirmed for your location and order.</p>
            </div>
            <div className="map-card" aria-label="Illustrative map highlighting advertised service states">
              <div className="map-card-top">
                <div><span>Regional coverage</span><strong>Mid-Atlantic & Northeast</strong></div>
                <span className="map-key">Advertised service areas</span>
              </div>
              <svg className="region-map" viewBox="0 0 520 330" role="img" aria-labelledby="map-title map-desc">
                <title id="map-title">Illustrative advertised service area</title>
                <desc id="map-desc">Simplified map diagram highlighting Maryland, Virginia, New York, New Jersey, and Delaware.</desc>
                <defs>
                  <pattern id="map-grid" width="22" height="22" patternUnits="userSpaceOnUse">
                    <path d="M22 0H0V22" fill="none" stroke="#d8e4ed" strokeWidth="0.7" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="520" height="330" fill="url(#map-grid)" opacity="0.46" />
                <path className="map-state highlight" d="M177 33 360 34 394 53 386 82 351 103 327 122 289 109 265 121 230 103 210 85 179 73Z" />
                <path className="map-state highlight" d="m355 112 23-8 13 30-4 34-12 23-13-10 5-30Z" />
                <path className="map-state highlight" d="m352 193 22-2 1 37-16 18-13-12Z" />
                <path className="map-state highlight" d="m207 133 143 1 8 35-18 20-5 31-34 7-18-17-31 2-18-16-34 2-15-19 11-21Z" />
                <path className="map-state highlight" d="m177 224 142 2-8 25-26 29-38 22-39-8-24-25-21-3 7-22Z" />
                <text className="map-state-label" x="282" y="80">NEW YORK</text>
                <text className="map-state-label" x="377" y="150" transform="rotate(83 377 150)">NJ</text>
                <text className="map-state-label" x="360" y="224">DE</text>
                <text className="map-state-label" x="289" y="180">MD</text>
                <text className="map-state-label" x="246" y="265">VA</text>
                <text className="map-label" x="116" y="309">ILLUSTRATIVE COVERAGE · BOUNDARIES SIMPLIFIED</text>
              </svg>
              <span className="map-note">No specific delivery points shown</span>
            </div>
          </div>
        </section>

        <section id="warranty" className="faq-section section-pad section-anchor">
          <div className="container-shell faq-layout reveal">
            <div className="faq-aside">
              <SectionHeading
                kicker="Straight answers"
                title="Know What You’re Buying."
                copy="A few details can make it easier to ask the right questions and move forward with confidence."
              />
              <button type="button" className="button-text" onClick={() => openQuote()}>Ask us a question <Icon name="arrow" className="h-4 w-4" /></button>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div className="faq-item" key={faq.question}>
                  <h3 className="m-0">
                    <button
                      className="faq-question"
                      type="button"
                      id={`faq-question-${index}`}
                      aria-expanded={openFaq === index}
                      aria-controls={`faq-answer-${index}`}
                      onClick={() => setOpenFaq((current) => current === index ? null : index)}
                    >
                      <span>{faq.question}</span><span className="faq-toggle"><Icon name="plus" className="h-4 w-4" /></span>
                    </button>
                  </h3>
                  <div id={`faq-answer-${index}`} className={`faq-answer${openFaq === index ? " open" : ""}`} role="region" aria-hidden={openFaq !== index} aria-labelledby={`faq-question-${index}`}>
                    <div className="faq-answer-inner"><p>{faq.answer}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="conversation"
          className="conversation-section section-anchor"
          style={{ backgroundImage: "url('/images/asante-hero.jpg')" }}
          aria-labelledby="conversation-title"
        >
          <div className="container-shell conversation-content reveal">
            <div>
              <span className="section-kicker">Here to help you get moving</span>
              <h2 id="conversation-title" className="section-title">Looking for the Right Part? Start With a Conversation.</h2>
              <p className="section-copy">Tell us what your vehicle needs. We’ll help you understand the options and what details to confirm before purchase.</p>
              <button type="button" className="button-primary" onClick={() => openQuote()}>Request a Part <Icon name="arrow" className="h-4 w-4" /></button>
            </div>
          </div>
        </section>

        <section id="request" className="request-section section-pad section-anchor">
          <div className="container-shell request-layout reveal">
            <div className="request-aside">
              <SectionHeading
                kicker="Request a part"
                title="Tell Us What Your Vehicle Needs."
                copy="Share the details you know, and we can help you check for a suitable replacement. A VIN is optional; never include payment information."
              />
              <div className="request-contact-note">
                <strong>Prefer to talk it through?</strong>
                <p>Call 717-812-1080 or 223-260-6661. The advertisement promotes 24/7 contact availability; please confirm response times directly.</p>
              </div>
            </div>
            <RequestForm />
          </div>
        </section>

        <section id="contact" className="contact-section section-pad section-anchor">
          <div className="container-shell reveal">
            <SectionHeading
              kicker="Contact Asante"
              title="Let’s Find the Part You Need."
              copy="Have vehicle details or questions about pickup and delivery? Talk with Asante Used Auto Parts directly."
            />
            <div className="contact-layout">
              <div>
                <div className="contact-numbers" aria-label="Call Asante Used Auto Parts">
                  <a className="contact-number" href="tel:+17178121080">
                    <span><Icon name="phone" className="h-5 w-5" />717-812-1080</span><span>Call Us</span>
                  </a>
                  <a className="contact-number" href="tel:+12232606661">
                    <span><Icon name="phone" className="h-5 w-5" />223-260-6661</span><span>Call Us</span>
                  </a>
                </div>
                <div className="contact-facts">
                  <div className="contact-fact"><strong>Service areas</strong><p>Maryland · Virginia · New York · New Jersey · Delaware</p></div>
                  <div className="contact-fact"><strong>Pickup & delivery</strong><p>Options are advertised. Ask us to confirm timing, location coverage, and pricing for your order.</p></div>
                  <div className="contact-fact"><strong>Contact availability</strong><p>24/7 availability is advertised. Please confirm response and availability for your specific request.</p></div>
                  <div className="contact-fact"><strong>Advertised payment methods</strong><p>Zelle and Cash App are listed as accepted methods. No payment is collected on this website.</p></div>
                </div>
                <button type="button" className="button-secondary" style={{ marginTop: 25 }} onClick={() => openQuote()}>Request a Part <Icon name="arrow" className="h-4 w-4" /></button>
              </div>
              <div className="contact-form-card">
                <h3>General inquiry</h3>
                <p>Send a local demonstration inquiry, or call us to reach the business directly.</p>
                <GeneralInquiryForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container-shell">
          <div className="footer-main">
            <div className="footer-brand">
              <BrandLogo />
              <p>Your destination for used engines, transmissions, and automotive replacement parts. Contact Asante Used Auto Parts to confirm fitment, availability, pricing, and delivery options.</p>
            </div>
            <div className="footer-column">
              <h3>Explore</h3>
              <a href="#home" onClick={(event) => handleNavClick(event, "home")}>Home</a>
              <a href="#find-parts" onClick={(event) => handleNavClick(event, "find-parts")}>Find a Part</a>
              <a href="#engines" onClick={(event) => handleNavClick(event, "engines")}>Engines</a>
              <a href="#transmissions" onClick={(event) => handleNavClick(event, "transmissions")}>Transmissions</a>
              <a href="#brands" onClick={(event) => handleNavClick(event, "brands")}>Vehicle Makes</a>
            </div>
            <div className="footer-column">
              <h3>Information</h3>
              <a href="#delivery" onClick={(event) => handleNavClick(event, "delivery")}>Delivery & Pickup</a>
              <a href="#warranty" onClick={(event) => handleNavClick(event, "warranty")}>Warranty & FAQ</a>
              <a href="#request" onClick={(event) => handleNavClick(event, "request")}>Request a Part</a>
              <a href="#contact" onClick={(event) => handleNavClick(event, "contact")}>Contact</a>
              <h3 style={{ marginTop: 23 }}>Brands</h3>
              <div className="footer-brand-list">
                {brands.map((brand) => <button key={brand} type="button" onClick={() => filterBrand(brand)}>{brand}</button>)}
              </div>
              <div className="footer-payment"><span>Zelle · advertised</span><span>Cash App · advertised</span></div>
            </div>
            <div className="footer-column">
              <h3>Call the team</h3>
              <span style={{ color: "rgba(223,237,248,.61)", fontSize: ".68rem" }}>24/7 contact availability advertised</span>
              <div className="footer-phone-list">
                <a href="tel:+17178121080">717-812-1080</a>
                <a href="tel:+12232606661">223-260-6661</a>
              </div>
              <p style={{ maxWidth: 210, marginTop: 14, color: "rgba(223,237,248,.55)", fontSize: ".66rem", lineHeight: 1.7 }}>Maryland · Virginia · New York · New Jersey · Delaware</p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Asante Used Auto Parts</span>
            <p>Sample listings and prices are for demonstration only. Contact the business to confirm inventory, fitment, condition, warranty terms, pricing, payment arrangements, and service availability.</p>
          </div>
        </div>
      </footer>

      {detailProduct && (
        <ModalShell title="Part details" onClose={() => setDetailProduct(null)}>
          <ProductDetails product={detailProduct} onRequest={requestProduct} />
        </ModalShell>
      )}
      {quotePrefill && (
        <ModalShell
          title={quotePrefill.category === "Transmission" ? "Request a transmission" : quotePrefill.category === "Engine" ? "Request an engine" : "Request a part"}
          onClose={() => setQuotePrefill(null)}
          narrow
        >
          <div className="modal-form-body"><RequestForm prefill={quotePrefill} /></div>
        </ModalShell>
      )}
      {deliveryModalOpen && (
        <ModalShell title="Check delivery or pickup options" onClose={() => setDeliveryModalOpen(false)} narrow>
          <DeliveryRequestForm />
        </ModalShell>
      )}
    </div>
  );
}

export default App;