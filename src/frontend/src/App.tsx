import { useCallback, useEffect, useRef, useState } from "react";
import { Board } from "./backend";
import { useActor } from "./hooks/useActor";

// ============================================================
// Types
// ============================================================
interface FormData {
  parentName: string;
  studentName: string;
  schoolName: string;
  standard: string;
  board: string;
  contactNumber: string;
}

interface FormErrors {
  parentName?: string;
  studentName?: string;
  schoolName?: string;
  standard?: string;
  board?: string;
  contactNumber?: string;
}

// ============================================================
// Facilities Data
// ============================================================
const facilities = [
  {
    id: 1,
    title: "Personalized Attention",
    image: "/assets/generated/facility-personalized-attention.dim_600x400.jpg",
    description:
      "Small batch sizes ensuring individual focus, customized learning methods, doubt-solving sessions, and progress tracking for every child.",
  },
  {
    id: 2,
    title: "Dedicated & Experienced Staff",
    image: "/assets/generated/facility-dedicated-staff.dim_600x400.jpg",
    description:
      "Qualified teachers who focus on conceptual clarity, discipline, motivation, and long-term academic success of every student.",
  },
  {
    id: 3,
    title: "Assessment & Regular Feedback",
    image: "/assets/generated/facility-assessment.dim_600x400.jpg",
    description:
      "Weekly tests, monthly evaluations, and detailed feedback reports shared with parents to monitor improvement continuously.",
  },
  {
    id: 4,
    title: "Healthy Learning Environment",
    image: "/assets/generated/facility-healthy-environment.dim_600x400.jpg",
    description:
      "Clean, well-ventilated classrooms that create a stress-free, motivating, and positive academic atmosphere every day.",
  },
  {
    id: 5,
    title: "Structured Test Series",
    image: "/assets/generated/facility-test-series.dim_600x400.jpg",
    description:
      "Exam-oriented practice papers based on ICSE, CBSE, and State Board patterns to build confidence before school exams.",
  },
  {
    id: 6,
    title: "Security & Supervision",
    image: "/assets/generated/facility-security.dim_600x400.jpg",
    description:
      "Safe premises with complete supervision to ensure every student's safety, discipline, and well-being at all times.",
  },
  {
    id: 7,
    title: "Flexible Batch Timings",
    image: "/assets/generated/facility-batch-timings.dim_600x400.jpg",
    description:
      "Convenient morning and evening batches designed according to school schedules for maximum learning flexibility.",
  },
  {
    id: 8,
    title: "Parent-Teacher Meetings",
    image: "/assets/generated/facility-ptm.dim_600x400.jpg",
    description:
      "Regular interaction between faculty and parents to discuss student progress, challenges, and improvement plans.",
  },
  {
    id: 9,
    title: "Meditation & Personality Development",
    image: "/assets/generated/facility-meditation.dim_600x400.jpg",
    description:
      "Guided meditation sessions and cultural activities that support mental well-being, confidence, and holistic growth.",
  },
  {
    id: 10,
    title: "Student Motivation & Encouragement",
    image: "/assets/generated/facility-motivation.dim_600x400.jpg",
    description:
      "Continuous appreciation, reward systems, and confidence-building sessions to inspire academic excellence in every child.",
  },
];

// ============================================================
// Smooth scroll helper
// ============================================================
function scrollToSection(href: string) {
  const target = document.querySelector(href);
  if (target) {
    const navHeight = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

// ============================================================
// FadeSection Component
// ============================================================
function FadeSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("is-visible");
            }, delay);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`fade-in-section ${className}`}>
      {children}
    </div>
  );
}

// ============================================================
// Navigation Component
// ============================================================
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#facilities", label: "Facilities" },
    { href: "#location", label: "Location" },
    { href: "#enquire", label: "Enquire" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <nav
      style={{
        background: "white",
        boxShadow: scrolled
          ? "0 2px 20px rgba(0,119,182,0.12)"
          : "0 1px 4px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.3s ease",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        {/* Logo – scroll to home */}
        <button
          type="button"
          onClick={() => scrollToSection("#home")}
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          aria-label="Shikhar Classes – Go to home"
        >
          <img
            src="/assets/generated/shikhar-logo-transparent.dim_400x200.png"
            alt="Shikhar Classes"
            style={{ height: "48px", width: "auto", objectFit: "contain" }}
          />
        </button>

        {/* Desktop Nav Links */}
        <div
          className="hidden md:flex"
          style={{ alignItems: "center", gap: "0.25rem" }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="nav-link"
              style={{
                color: "#334155",
                fontSize: "0.92rem",
                fontWeight: 500,
                padding: "0.5rem 0.85rem",
                textDecoration: "none",
                letterSpacing: "0.01em",
              }}
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => scrollToSection("#enquire")}
            style={{
              background: "#0077b6",
              color: "white",
              padding: "0.55rem 1.2rem",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.92rem",
              marginLeft: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Enroll Now
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <span
            className="hamburger-line"
            style={
              menuOpen
                ? { transform: "translateY(8px) rotate(45deg)" }
                : undefined
            }
          />
          <span
            className="hamburger-line"
            style={
              menuOpen ? { opacity: 0, transform: "scaleX(0)" } : undefined
            }
          />
          <span
            className="hamburger-line"
            style={
              menuOpen
                ? { transform: "translateY(-8px) rotate(-45deg)" }
                : undefined
            }
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden mobile-menu-open"
          style={{
            background: "white",
            borderTop: "1px solid #e6f4ff",
            padding: "1rem 1.5rem 1.5rem",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                display: "block",
                color: "#334155",
                fontWeight: 500,
                padding: "0.75rem 0",
                textDecoration: "none",
                borderBottom: "1px solid #e6f4ff",
                fontSize: "1rem",
              }}
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              scrollToSection("#enquire");
            }}
            style={{
              display: "block",
              background: "#0077b6",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "1rem",
              textAlign: "center",
              marginTop: "1rem",
              border: "none",
              cursor: "pointer",
              width: "100%",
              fontFamily: "inherit",
            }}
          >
            Enroll Now
          </button>
        </div>
      )}
    </nav>
  );
}

// ============================================================
// Hero Section
// ============================================================
function HeroSection() {
  const handleEnrollClick = () => scrollToSection("#enquire");

  return (
    <section
      id="home"
      style={{
        background:
          "linear-gradient(160deg, #e6f4ff 0%, #d0ecff 40%, #caf0f8 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: "72px",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="blob-1"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "8%",
          right: "5%",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(202,240,248,0.7) 0%, rgba(202,240,248,0) 70%)",
          filter: "blur(4px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="blob-2"
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "10%",
          left: "3%",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(144,201,232,0.45) 0%, rgba(144,201,232,0) 70%)",
          filter: "blur(6px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="blob-3"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "40%",
          left: "60%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,119,182,0.08) 0%, rgba(0,119,182,0) 70%)",
          filter: "blur(8px)",
          pointerEvents: "none",
        }}
      />

      {/* Decorative grid */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(0,119,182,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          textAlign: "center",
          padding: "2rem 1.5rem",
          maxWidth: "760px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="hero-animate hero-animate-d1"
          style={{
            display: "inline-block",
            background: "rgba(0,119,182,0.1)",
            color: "#0077b6",
            padding: "0.4rem 1.2rem",
            borderRadius: "100px",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "1.25rem",
            border: "1px solid rgba(0,119,182,0.2)",
          }}
        >
          🎓 Admissions Open 2026–27
        </div>

        <h1
          className="hero-animate hero-animate-d2"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
            fontWeight: 800,
            color: "#0077b6",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          Shikhar Classes
        </h1>

        <div
          className="hero-animate hero-animate-d3"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
            fontWeight: 700,
            color: "#023e8a",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          ICSE &nbsp;–&nbsp; CBSE &nbsp;–&nbsp; State Board
        </div>

        <div
          className="hero-animate hero-animate-d3"
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
            fontWeight: 600,
            color: "#023e8a",
            marginBottom: "1rem",
            opacity: 0.85,
          }}
        >
          From Grade I to X
        </div>

        <p
          className="hero-animate hero-animate-d4"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            fontStyle: "italic",
            color: "#4a7fa0",
            marginBottom: "2.5rem",
            lineHeight: 1.5,
          }}
        >
          "Where Learning Meets Personal Attention"
        </p>

        <div
          className="hero-animate hero-animate-d5"
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handleEnrollClick}
            style={{
              background: "#0077b6",
              color: "white",
              padding: "0.9rem 2.2rem",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,119,182,0.3)",
              letterSpacing: "0.01em",
              fontFamily: "inherit",
            }}
          >
            Enroll Now
          </button>

          <a
            href="https://wa.me/917715813926"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#25D366",
              color: "white",
              padding: "0.9rem 2.2rem",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
              letterSpacing: "0.01em",
            }}
          >
            <WhatsAppIcon size={20} />
            Enquire on WhatsApp
          </a>
        </div>

        {/* Trust badges */}
        <div
          className="hero-animate hero-animate-d5"
          style={{
            display: "flex",
            gap: "1.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "3rem",
          }}
        >
          {[
            { icon: "👨‍🏫", text: "Expert Faculty" },
            { icon: "📚", text: "All Boards" },
            { icon: "🏆", text: "Proven Results" },
            { icon: "📍", text: "Bhandup & Mulund" },
          ].map((item) => (
            <div
              key={item.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(8px)",
                padding: "0.45rem 1rem",
                borderRadius: "100px",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#023e8a",
                border: "1px solid rgba(0,119,182,0.15)",
              }}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          color: "#90b8d0",
          fontSize: "0.75rem",
          fontWeight: 500,
          animation: "float-1 3s ease-in-out infinite",
        }}
      >
        <span>Scroll to explore</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          role="presentation"
        >
          <title>Scroll down</title>
          <path
            d="M10 4v12M5 11l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}

// ============================================================
// Facility Card
// ============================================================
function FacilityCard({
  title,
  image,
  description,
  delay = 0,
}: {
  title: string;
  image: string;
  description: string;
  delay?: number;
}) {
  return (
    <FadeSection delay={delay}>
      <article
        className="facility-card"
        style={{
          background: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow:
            "0 4px 24px rgba(0,119,182,0.08), 0 1px 4px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{ position: "relative", overflow: "hidden", flexShrink: 0 }}
        >
          <img
            src={image}
            alt={`${title} at Shikhar Classes`}
            loading="lazy"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60px",
              background:
                "linear-gradient(to top, rgba(255,255,255,0.9), transparent)",
            }}
          />
        </div>
        <div style={{ padding: "1.25rem 1.4rem 1.5rem", flexGrow: 1 }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#0077b6",
              marginBottom: "0.5rem",
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#4a6176",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>
      </article>
    </FadeSection>
  );
}

// ============================================================
// Facilities Section
// ============================================================
function FacilitiesSection() {
  return (
    <section
      id="facilities"
      style={{
        background: "#f0f8ff",
        padding: "5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(0,119,182,0.1)",
                color: "#0077b6",
                padding: "0.35rem 1rem",
                borderRadius: "100px",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              What We Offer
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontWeight: 800,
                color: "#0077b6",
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Our Facilities
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                color: "#4a7fa0",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Designed for every student's success
            </p>
          </div>
        </FadeSection>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {facilities.map((facility, i) => (
            <FacilityCard
              key={facility.id}
              title={facility.title}
              image={facility.image}
              description={facility.description}
              delay={Math.min(i % 3, 2) * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// About Section
// ============================================================
function AboutSection() {
  return (
    <section
      id="about"
      style={{
        background: "#e6f4ff",
        padding: "5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(0,119,182,0.1)",
                color: "#0077b6",
                padding: "0.35rem 1rem",
                borderRadius: "100px",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Who We Are
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontWeight: 800,
                color: "#0077b6",
                letterSpacing: "-0.02em",
              }}
            >
              About Shikhar Classes
            </h2>
          </div>
        </FadeSection>

        <FadeSection delay={100}>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "clamp(1.75rem, 4vw, 3rem)",
              boxShadow: "0 4px 32px rgba(0,119,182,0.1)",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
                color: "#334155",
                lineHeight: 1.85,
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong style={{ color: "#0077b6" }}>Shikhar Classes</strong> is
                a trusted coaching institute located in the heart of{" "}
                <strong>Bhandup (W) and Mulund (W), Mumbai</strong>, dedicated
                to providing quality education for students from Grade 1 to
                Grade 10 across ICSE, CBSE, and State Board curricula.
              </p>
              <p style={{ margin: 0 }}>
                Our teaching philosophy is rooted in <em>conceptual clarity</em>
                , personal mentoring, and consistent academic discipline. We
                believe every child has the potential to excel, and our
                experienced faculty work tirelessly to nurture that potential
                through structured guidance and care.
              </p>
              <p style={{ margin: 0 }}>
                At Shikhar Classes, we don't just teach — we{" "}
                <strong>inspire</strong>. From small batch sizes that ensure
                individual attention to regular parent feedback sessions, every
                aspect of our institute is designed to give your child the best
                possible academic foundation and the confidence to shine.
              </p>
            </div>
          </div>
        </FadeSection>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            {
              icon: "📚",
              title: "Grade 1–10",
              subtitle: "All Boards Covered",
              detail: "ICSE · CBSE · State Board",
            },
            {
              icon: "👥",
              title: "Small Batches",
              subtitle: "Personal Attention",
              detail: "Individual focus for every child",
            },
            {
              icon: "📍",
              title: "Two Locations",
              subtitle: "Bhandup & Mulund",
              detail: "Convenient access across Mumbai",
            },
          ].map((stat, i) => (
            <FadeSection key={stat.title} delay={i * 120}>
              <div
                className="stat-card"
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0,119,182,0.08)",
                  border: "1px solid rgba(0,119,182,0.08)",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{ fontSize: "2rem", marginBottom: "0.5rem" }}
                >
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#023e8a",
                    marginBottom: "0.2rem",
                  }}
                >
                  {stat.title}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#0077b6",
                    marginBottom: "0.3rem",
                  }}
                >
                  {stat.subtitle}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#7a9ab0" }}>
                  {stat.detail}
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Map Tabs Component
// ============================================================
function MapTabs() {
  const [activeTab, setActiveTab] = useState<"bhandup" | "mulund">("bhandup");

  return (
    <div
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,119,182,0.15)",
        background: "white",
      }}
    >
      {/* Tab Switcher */}
      <div
        style={{
          display: "flex",
          background: "#e6f4ff",
          borderBottom: "1px solid rgba(0,119,182,0.12)",
        }}
      >
        {(
          [
            { id: "bhandup", label: "📍 Bhandup (W)" },
            { id: "mulund", label: "📍 Mulund (W)" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`map.${tab.id}.tab`}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              background: activeTab === tab.id ? "white" : "transparent",
              color: activeTab === tab.id ? "#0077b6" : "#7a9ab0",
              borderBottom:
                activeTab === tab.id
                  ? "2px solid #0077b6"
                  : "2px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Map Frames */}
      <div style={{ position: "relative" }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.6!2d72.9328!3d19.1455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b8d0f3a5b7c1%3A0x7a8e3d1c2b4f5e6a!2sKokan%20Nagar%2C%20Bhandup%20West%2C%20Mumbai%2C%20Maharashtra%20400078!5e0!3m2!1sen!2sin!4v1700000000001!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{
            border: 0,
            display: activeTab === "bhandup" ? "block" : "none",
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Shikhar Classes Bhandup Location"
          data-ocid="map.bhandup.canvas_target"
        />
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.9!2d72.9564!3d19.1730!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b90e3c7b5f1d%3A0x4d5a6b7c8e9f0a1b!2sMG%20Road%2C%20Mulund%20West%2C%20Mumbai%2C%20Maharashtra%20400080!5e0!3m2!1sen!2sin!4v1700000000002!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{
            border: 0,
            display: activeTab === "mulund" ? "block" : "none",
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Shikhar Classes Mulund Location"
          data-ocid="map.mulund.canvas_target"
        />
      </div>

      {/* Direction Links */}
      <div
        style={{
          padding: "0.85rem 1rem",
          background: "#f0f8ff",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <a
          href={
            activeTab === "bhandup"
              ? "https://www.google.com/maps/dir/?api=1&destination=Kokan+Nagar+Bhandup+West+Mumbai"
              : "https://www.google.com/maps/dir/?api=1&destination=MG+Road+Mulund+West+Mumbai"
          }
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="map.directions.link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "#0077b6",
            fontWeight: 600,
            fontSize: "0.875rem",
            textDecoration: "none",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          Get Directions to{" "}
          {activeTab === "bhandup" ? "Bhandup (W)" : "Mulund (W)"}
        </a>
      </div>
    </div>
  );
}

// ============================================================
// Location Section
// ============================================================
function LocationSection() {
  return (
    <section
      id="location"
      style={{
        background: "#caf0f8",
        padding: "5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(0,119,182,0.12)",
                color: "#0077b6",
                padding: "0.35rem 1rem",
                borderRadius: "100px",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Visit Us
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontWeight: 800,
                color: "#0077b6",
                letterSpacing: "-0.02em",
              }}
            >
              Find Us
            </h2>
          </div>
        </FadeSection>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Address Block */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <FadeSection delay={0}>
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  boxShadow: "0 4px 20px rgba(0,119,182,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: "1.4rem" }}>
                    🏫
                  </span>
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "#023e8a",
                      margin: 0,
                    }}
                  >
                    Shikhar Classes – Bhandup (W)
                  </h3>
                </div>
                <address
                  style={{
                    fontStyle: "normal",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.65rem",
                  }}
                >
                  <LocationItem
                    icon="📍"
                    text="Opp. Criticare Hospital, Near Arunodaya Tower, Kokan Nagar, Bhandup (W), Mumbai"
                  />
                  <LocationItem icon="📞" text="7715813926" />
                  <LocationItem icon="🕐" text="Enquiry Timing: 7 PM – 9 PM" />
                </address>
                <a
                  href="https://wa.me/917715813926"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "#25D366",
                    color: "white",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    marginTop: "1rem",
                  }}
                >
                  <WhatsAppIcon size={18} />
                  Chat on WhatsApp
                </a>
              </div>
            </FadeSection>

            <FadeSection delay={150}>
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  boxShadow: "0 4px 20px rgba(0,119,182,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: "1.4rem" }}>
                    🏫
                  </span>
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "#023e8a",
                      margin: 0,
                    }}
                  >
                    Shikhar Classes – Mulund (W)
                  </h3>
                </div>
                <address
                  style={{
                    fontStyle: "normal",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.65rem",
                  }}
                >
                  <LocationItem
                    icon="📍"
                    text="1st Floor, Kailash Residency, 101, MG Road, next to Ambaji Dham, Gavane Pada, Mulund (W), Mumbai"
                  />
                  <LocationItem icon="📞" text="7715813926" />
                  <LocationItem icon="🕐" text="Enquiry Timing: 3 PM – 5 PM" />
                </address>
                <a
                  href="https://wa.me/917715813926"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "#25D366",
                    color: "white",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    marginTop: "1rem",
                  }}
                >
                  <WhatsAppIcon size={18} />
                  Chat on WhatsApp
                </a>
              </div>
            </FadeSection>
          </div>

          {/* Map */}
          <FadeSection delay={200}>
            <MapTabs />
          </FadeSection>
        </div>
      </div>
    </section>
  );
}

function LocationItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
      <span
        aria-hidden="true"
        style={{ fontSize: "1rem", flexShrink: 0, marginTop: "0.05rem" }}
      >
        {icon}
      </span>
      <span style={{ fontSize: "0.875rem", color: "#4a6176", lineHeight: 1.5 }}>
        {text}
      </span>
    </div>
  );
}

// ============================================================
// Enquiry Form Section
// ============================================================
function EnquirySection() {
  const { actor } = useActor();
  const [formData, setFormData] = useState<FormData>({
    parentName: "",
    studentName: "",
    schoolName: "",
    standard: "",
    board: "",
    contactNumber: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.parentName.trim())
      newErrors.parentName = "Parent name is required";
    if (!formData.studentName.trim())
      newErrors.studentName = "Student name is required";
    if (!formData.schoolName.trim())
      newErrors.schoolName = "School name is required";
    if (!formData.standard) newErrors.standard = "Please select a grade";
    if (!formData.board) newErrors.board = "Please select a board";
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber.trim())) {
      newErrors.contactNumber = "Enter a valid 10-digit number";
    }
    return newErrors;
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const getBoardEnum = (boardStr: string): Board => {
    switch (boardStr) {
      case "ICSE":
        return Board.ICSE;
      case "CBSE":
        return Board.CBSE;
      default:
        return Board.StateBoard;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.querySelector<HTMLElement>(
        `[name="${firstErrorKey}"]`,
      );
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const boardEnum = getBoardEnum(formData.board);
      if (actor) {
        await actor.submitEnquiry(
          formData.parentName.trim(),
          formData.studentName.trim(),
          BigInt(formData.standard),
          boardEnum,
          formData.contactNumber.trim(),
        );
      }

      const boardDisplay =
        formData.board === "StateBoard" ? "State Board" : formData.board;
      const msg = `New Enquiry from Shikhar Classes Website%0A%0AParent Name: ${encodeURIComponent(formData.parentName)}%0AStudent Name: ${encodeURIComponent(formData.studentName)}%0ASchool Name: ${encodeURIComponent(formData.schoolName)}%0AStandard: Grade ${formData.standard}%0ABoard: ${boardDisplay}%0AContact: ${formData.contactNumber}`;
      window.open(`https://wa.me/917715813926?text=${msg}`, "_blank");

      setIsSuccess(true);
      setFormData({
        parentName: "",
        studentName: "",
        schoolName: "",
        standard: "",
        board: "",
        contactNumber: "",
      });
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError(
        "Something went wrong. Please try again or contact us directly on WhatsApp.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "0.7rem 1rem",
    borderRadius: "8px",
    border: hasError ? "1.5px solid #e53e3e" : "1.5px solid #c8dfe8",
    fontSize: "0.95rem",
    color: "#1e3a5f",
    background: hasError ? "#fff5f5" : "white",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    fontFamily: "inherit",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#023e8a",
    marginBottom: "0.4rem",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "0.78rem",
    color: "#e53e3e",
    marginTop: "0.3rem",
  };

  return (
    <section
      id="enquire"
      style={{
        background: "white",
        padding: "5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(0,119,182,0.1)",
                color: "#0077b6",
                padding: "0.35rem 1rem",
                borderRadius: "100px",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Get In Touch
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                fontWeight: 800,
                color: "#0077b6",
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Enquire Now
            </h2>
            <p style={{ fontSize: "1rem", color: "#4a7fa0" }}>
              Fill in the details below and we'll get back to you shortly
            </p>
          </div>
        </FadeSection>

        <FadeSection delay={100}>
          {isSuccess ? (
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "3rem 2rem",
                boxShadow: "0 8px 40px rgba(0,119,182,0.12)",
                textAlign: "center",
              }}
            >
              <div
                aria-hidden="true"
                style={{ fontSize: "4rem", marginBottom: "1rem" }}
              >
                🎉
              </div>
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#023e8a",
                  marginBottom: "0.75rem",
                }}
              >
                Enquiry Submitted Successfully!
              </h3>
              <p
                style={{
                  color: "#4a6176",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                }}
              >
                Thank you for your interest in Shikhar Classes. We've also
                opened WhatsApp so you can reach us directly. We'll get back to
                you soon!
              </p>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                style={{
                  background: "#0077b6",
                  color: "white",
                  padding: "0.7rem 1.8rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "clamp(1.75rem, 4vw, 2.5rem)",
                boxShadow: "0 8px 40px rgba(0,119,182,0.12)",
                border: "1px solid rgba(0,119,182,0.08)",
              }}
            >
              <form onSubmit={handleSubmit} noValidate>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  {/* Parent Name */}
                  <div>
                    <label htmlFor="parentName" style={labelStyle}>
                      Parent Name{" "}
                      <span aria-hidden="true" style={{ color: "#e53e3e" }}>
                        *
                      </span>
                    </label>
                    <input
                      id="parentName"
                      name="parentName"
                      type="text"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Enter parent's full name"
                      style={inputStyle(!!errors.parentName)}
                      className="shikhar-input"
                      autoComplete="name"
                      aria-required="true"
                      aria-invalid={!!errors.parentName}
                      aria-describedby={
                        errors.parentName ? "parentName-error" : undefined
                      }
                    />
                    {errors.parentName && (
                      <p id="parentName-error" style={errorStyle} role="alert">
                        {errors.parentName}
                      </p>
                    )}
                  </div>

                  {/* Student Name */}
                  <div>
                    <label htmlFor="studentName" style={labelStyle}>
                      Student Name{" "}
                      <span aria-hidden="true" style={{ color: "#e53e3e" }}>
                        *
                      </span>
                    </label>
                    <input
                      id="studentName"
                      name="studentName"
                      type="text"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="Enter student's full name"
                      style={inputStyle(!!errors.studentName)}
                      className="shikhar-input"
                      autoComplete="off"
                      aria-required="true"
                      aria-invalid={!!errors.studentName}
                      aria-describedby={
                        errors.studentName ? "studentName-error" : undefined
                      }
                    />
                    {errors.studentName && (
                      <p id="studentName-error" style={errorStyle} role="alert">
                        {errors.studentName}
                      </p>
                    )}
                  </div>

                  {/* School Name */}
                  <div>
                    <label htmlFor="schoolName" style={labelStyle}>
                      School Name{" "}
                      <span aria-hidden="true" style={{ color: "#e53e3e" }}>
                        *
                      </span>
                    </label>
                    <input
                      id="schoolName"
                      name="schoolName"
                      type="text"
                      value={formData.schoolName}
                      onChange={handleChange}
                      placeholder="Enter student's school name"
                      style={inputStyle(!!errors.schoolName)}
                      className="shikhar-input"
                      autoComplete="off"
                      aria-required="true"
                      aria-invalid={!!errors.schoolName}
                      aria-describedby={
                        errors.schoolName ? "schoolName-error" : undefined
                      }
                      data-ocid="enquiry.school_name.input"
                    />
                    {errors.schoolName && (
                      <p id="schoolName-error" style={errorStyle} role="alert">
                        {errors.schoolName}
                      </p>
                    )}
                  </div>

                  {/* Standard & Board row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <label htmlFor="standard" style={labelStyle}>
                        Grade{" "}
                        <span aria-hidden="true" style={{ color: "#e53e3e" }}>
                          *
                        </span>
                      </label>
                      <select
                        id="standard"
                        name="standard"
                        value={formData.standard}
                        onChange={handleChange}
                        style={{
                          ...inputStyle(!!errors.standard),
                          cursor: "pointer",
                        }}
                        className="shikhar-input"
                        aria-required="true"
                        aria-invalid={!!errors.standard}
                        aria-describedby={
                          errors.standard ? "standard-error" : undefined
                        }
                      >
                        <option value="">Select Grade</option>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (g) => (
                            <option key={g} value={String(g)}>
                              Grade {g}
                            </option>
                          ),
                        )}
                      </select>
                      {errors.standard && (
                        <p id="standard-error" style={errorStyle} role="alert">
                          {errors.standard}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="board" style={labelStyle}>
                        Board{" "}
                        <span aria-hidden="true" style={{ color: "#e53e3e" }}>
                          *
                        </span>
                      </label>
                      <select
                        id="board"
                        name="board"
                        value={formData.board}
                        onChange={handleChange}
                        style={{
                          ...inputStyle(!!errors.board),
                          cursor: "pointer",
                        }}
                        className="shikhar-input"
                        aria-required="true"
                        aria-invalid={!!errors.board}
                        aria-describedby={
                          errors.board ? "board-error" : undefined
                        }
                      >
                        <option value="">Select Board</option>
                        <option value="ICSE">ICSE</option>
                        <option value="CBSE">CBSE</option>
                        <option value="StateBoard">State Board</option>
                      </select>
                      {errors.board && (
                        <p id="board-error" style={errorStyle} role="alert">
                          {errors.board}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label htmlFor="contactNumber" style={labelStyle}>
                      Contact Number{" "}
                      <span aria-hidden="true" style={{ color: "#e53e3e" }}>
                        *
                      </span>
                    </label>
                    <input
                      id="contactNumber"
                      name="contactNumber"
                      type="tel"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      style={inputStyle(!!errors.contactNumber)}
                      className="shikhar-input"
                      autoComplete="tel"
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      aria-required="true"
                      aria-invalid={!!errors.contactNumber}
                      aria-describedby={
                        errors.contactNumber ? "contactNumber-error" : undefined
                      }
                    />
                    {errors.contactNumber && (
                      <p
                        id="contactNumber-error"
                        style={errorStyle}
                        role="alert"
                      >
                        {errors.contactNumber}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      style={{
                        background: "#fff5f5",
                        border: "1px solid #fed7d7",
                        color: "#c53030",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                      }}
                    >
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: isSubmitting ? "#5aabcf" : "#0077b6",
                      color: "white",
                      padding: "0.9rem",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "1rem",
                      border: "none",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      width: "100%",
                      letterSpacing: "0.01em",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      fontFamily: "inherit",
                    }}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <span>Submit Enquiry</span>
                        <WhatsAppIcon size={18} />
                      </>
                    )}
                  </button>

                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "#7a9ab0",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    Your details will also be sent via WhatsApp for quick
                    response
                  </p>
                </div>
              </form>
            </div>
          )}
        </FadeSection>
      </div>
    </section>
  );
}

// ============================================================
// Footer
// ============================================================
function Footer() {
  const year = new Date().getFullYear();
  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#facilities", label: "Facilities" },
    { href: "#location", label: "Location" },
    { href: "#enquire", label: "Enquire" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    scrollToSection(href);
  };

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #023e8a 0%, #0077b6 100%)",
        color: "white",
        padding: "3rem 1.5rem 2rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "1rem" }}>
          <img
            src="/assets/generated/shikhar-logo-transparent.dim_400x200.png"
            alt="Shikhar Classes"
            style={{
              height: "52px",
              width: "auto",
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
              opacity: 0.9,
            }}
          />
        </div>

        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            marginBottom: "0.25rem",
            letterSpacing: "0.02em",
          }}
        >
          Shikhar Classes
        </h2>
        <p
          style={{ fontSize: "0.875rem", opacity: 0.75, marginBottom: "1rem" }}
        >
          Bhandup (W) &amp; Mulund (W), Mumbai
        </p>

        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            padding: "0.4rem 1.2rem",
            borderRadius: "100px",
            fontSize: "0.82rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
          }}
        >
          🎓 Admissions Open for 2026–27
        </div>

        <p
          style={{ fontSize: "0.9rem", opacity: 0.85, marginBottom: "1.5rem" }}
        >
          Contact:{" "}
          <a
            href="tel:7715813926"
            style={{ color: "white", textDecoration: "underline" }}
          >
            7715813926
          </a>
        </p>

        <nav
          aria-label="Footer navigation"
          style={{
            display: "flex",
            gap: "0.25rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "0.82rem",
                textDecoration: "none",
                padding: "0.3rem 0.7rem",
                borderRadius: "4px",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: "1.25rem",
          }}
        >
          <p
            style={{
              fontSize: "0.8rem",
              opacity: 0.65,
              marginBottom: "0.4rem",
            }}
          >
            © {year} Shikhar Classes. All rights reserved.
          </p>
          <p style={{ fontSize: "0.78rem", opacity: 0.5 }}>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "rgba(255,255,255,0.7)",
                textDecoration: "underline",
              }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// Floating WhatsApp Button
// ============================================================
function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/917715813926"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="wa-pulse"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "#25D366",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(37,211,102,0.5)",
        zIndex: 999,
        textDecoration: "none",
      }}
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}

// ============================================================
// Icons
// ============================================================
function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>
        {
          "@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"
        }
      </style>
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
      />
      <path
        d="M9 2a7 7 0 017 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ============================================================
// Main App
// ============================================================
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FacilitiesSection />
        <AboutSection />
        <LocationSection />
        <EnquirySection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
