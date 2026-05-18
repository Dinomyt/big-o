import { useState, useCallback } from "react";

const questions = [
  {
    category: "Opening",
    q: "Tell us about yourself and why you're interested in this position.",
    tip: "Lead with the CodeStack connection — you're a graduate of SJCOE's own program. Then hit: full-stack engineer at Keasy building multi-tenant production systems, CS degree from CSUMB, supervisory experience at Costco. End with why you want to come back to SJCOE. Keep it under 90 seconds.",
    keywords: ["CodeStack graduate", "full-stack", "multi-tenant systems", "CSUMB", "full circle"]
  },
  {
    category: "Opening",
    q: "What do you know about SJCOE and the work we do in Information Technology / Business Services?",
    tip: "Show you've done your homework. SJCOE is a regional agency serving 14 school districts and 151,000+ students. The IT/Business Services division maintains K-12 administrative systems — financial, payroll, HR, student information. Mention that you know CodeStack is one of their programs and that the IT team supports critical infrastructure for the entire county's education system.",
    keywords: ["14 school districts", "K-12 admin systems", "payroll/HR/financial", "CodeStack", "regional agency"]
  },
  {
    category: "Technical",
    q: "Describe the most complex system you've designed and built from scratch.",
    tip: "This is your Slack reporting system. Structure it as: Problem → Design → Implementation → Result. 100+ orgs needed automated security reports. You designed a multi-tenant architecture with isolated webhooks, per-org Oban scheduling, and Slack Block Kit delivery. Built a Puppeteer/Node.js microservice, Dockerized it, deployed on AWS ECS with Fargate. The result: a scalable, production-grade reporting pipeline.",
    keywords: ["multi-tenant", "Puppeteer microservice", "Oban scheduling", "AWS ECS/Fargate", "100+ organizations"]
  },
  {
    category: "Technical",
    q: "This role involves working with Microsoft SQL Server and Transact-SQL. Tell us about your database experience.",
    tip: "Be honest — your primary experience is PostgreSQL, not SQL Server. But emphasize that SQL fundamentals transfer directly: you've written complex queries, designed schemas, managed migrations, and worked with relational databases in production at scale. Mention any SQL Server exposure from CodeStack or coursework. Show eagerness to ramp up quickly — your track record with Elixir proves you learn fast.",
    keywords: ["PostgreSQL production experience", "schema design", "migrations", "SQL transfers", "fast learner"]
  },
  {
    category: "Technical",
    q: "Tell us about your experience with API development and system integration.",
    tip: "Strong answer here. At Keasy you designed RESTful APIs and integrated with the Slack API across 100+ organizations. Your Puppeteer microservice communicates between Elixir/Phoenix, Node.js, and external Slack workspaces — that's real system integration. Also mention ASP.NET Core and your experience synchronizing real-time data between frontend and backend.",
    keywords: ["RESTful API design", "Slack API integration", "microservice architecture", "cross-system communication", "ASP.NET Core"]
  },
  {
    category: "Technical",
    q: "How do you approach testing and ensuring the quality of systems before they go live?",
    tip: "The JD emphasizes 'comprehensive test plans' and 'reproducing failed tests.' Talk about your unit testing with JUnit, system testing with Selenium WebDriver, and peer code reviews at Keasy. Highlight that you built live webhook testing directly into the settings UI so ops teams could verify configurations before going live. Mention your CI/CD pipeline experience.",
    keywords: ["JUnit", "Selenium", "peer code reviews", "live webhook testing", "CI/CD pipelines"]
  },
  {
    category: "Technical",
    q: "This role involves maintaining and modernizing legacy systems. How would you approach inheriting a codebase you've never seen before?",
    tip: "Show methodical thinking: start by reading existing documentation, studying data flow diagrams, and understanding the system's dependencies. Run the existing test suite. Talk to the people who use it daily — they know the pain points. At Topcon you did exactly this with SAP C4/Hana — you inherited a CRM system you'd never used and conducted database cleanups to improve it. Emphasize documentation as you go.",
    keywords: ["read documentation first", "understand dependencies", "talk to users", "SAP C4/Hana experience", "document as you go"]
  },
  {
    category: "Technical",
    q: "Tell us about your experience with cloud infrastructure and deployment.",
    tip: "Walk through your AWS experience at Keasy: S3 for storage, EC2 for compute, and most impressively, ECS with Fargate for your Dockerized Puppeteer microservice. Mention that you designed the migration path from Fly.io to AWS as customer volume scaled. Show you think about infrastructure decisions in terms of cost, scalability, and operational complexity.",
    keywords: ["AWS S3/EC2/ECS", "Docker", "Fargate", "migration planning", "scalability decisions"]
  },
  {
    category: "Behavioral",
    q: "Tell us about a time you had to learn a new technology quickly to meet a deadline.",
    tip: "Elixir/Phoenix at Keasy is your best answer. It's not a mainstream language — you picked it up on the job and are now building production-grade Oban job queues, Phoenix backends, and encrypted credential storage with it. Show the progression from learning to building complex systems.",
    keywords: ["Elixir/Phoenix", "self-directed learning", "production-grade output", "Oban job queues"]
  },
  {
    category: "Behavioral",
    q: "Describe a situation where you had to work with non-technical stakeholders to understand their needs.",
    tip: "This role serves school districts. Use your Costco supervisory experience — you translate data and system insights into actionable decisions for teams that don't think in code. Also reference your Topcon internship where you worked across departments gathering requirements. The JD specifically mentions 'gathering requirements through study of existing documentation, workflows, procedures.'",
    keywords: ["translating technical to non-technical", "Costco data analysis", "cross-department work", "requirements gathering"]
  },
  {
    category: "Behavioral",
    q: "Give us an example of a time you disagreed with a technical decision. How did you handle it?",
    tip: "Pick a real example from Keasy sprint planning — maybe a deployment strategy, architecture choice, or library decision. Show that you presented your reasoning with evidence, listened to the other perspective, and either convinced the team or committed to the group decision. The JD values someone who can 'analyze situations accurately and adopt an effective course of action.'",
    keywords: ["evidence-based argument", "active listening", "commit or convince", "professional disagreement"]
  },
  {
    category: "Behavioral",
    q: "How do you prioritize when you have multiple competing deadlines?",
    tip: "Reference your dual work experience — you're juggling Keasy engineering work and Costco supervision simultaneously while finishing your degree. At Keasy, you work in Agile sprints with Jira, so you're used to prioritizing a backlog. At Costco, you manage daily operational priorities. Show that you communicate early if timelines are at risk.",
    keywords: ["Jira backlog management", "sprint planning", "communicate early", "juggling multiple roles"]
  },
  {
    category: "Leadership",
    q: "This position may require you to assume the Director of Applications' responsibilities. How do you feel about that level of responsibility?",
    tip: "Express genuine enthusiasm. You already have supervisory experience at Costco — overseeing operations, managing workflows, making decisions. At Keasy, you contribute to architectural decisions and unblock teammates. Frame yourself as someone who leads through technical expertise AND people skills. Mention you're actively developing your management capabilities.",
    keywords: ["Costco supervisor experience", "architectural decision-making", "unblocking teammates", "growth mindset"]
  },
  {
    category: "Leadership",
    q: "Tell us about your experience supervising or mentoring others.",
    tip: "At Costco you supervise depot operations — that's managing real people, workflows, and standards. At Keasy you unblock teammates across frontend and backend. If you've done any code reviews or onboarding of new team members, mention that. The JD lists 'supervise and evaluate staff' as an essential function.",
    keywords: ["depot operations supervision", "unblocking teammates", "code reviews", "cross-functional support"]
  },
  {
    category: "Leadership",
    q: "How would you handle providing training and support to users with varying levels of technical ability?",
    tip: "The JD says 'provide training and support to a diverse customer base.' Draw from Costco (training team members on AS400 reports, Google Sheets workflows) and Topcon (supporting across IT departments). Show you adjust your communication style based on the audience. Mention creating documentation and reusable templates — you did this at Topcon.",
    keywords: ["adjust communication style", "reusable templates", "diverse skill levels", "documentation"]
  },
  {
    category: "K-12 Domain",
    q: "What experience do you have with K-12 administrative systems, or how would you ramp up on the compliance requirements (PERS, STRS, ACA, etc.)?",
    tip: "Be honest that you don't have K-12 domain experience — but pivot hard. You've ramped up across unfamiliar domains repeatedly: property management at Keasy, warehouse/inventory at Costco, CRM/SAP at Topcon. Your Cybersecurity certification shows you learn compliance-heavy domains quickly. Ask if there's documentation or training you could begin reviewing before your start date.",
    keywords: ["fast domain learner", "multiple industries", "cybersecurity cert", "proactive ramping"]
  },
  {
    category: "K-12 Domain",
    q: "How would you approach designing a dashboard or reporting tool for school district administrators?",
    tip: "You've built exactly this kind of system. At Keasy, you built automated report cards rendered as PNGs and delivered via Slack — that's a reporting tool for non-technical stakeholders. Walk through your approach: understand what metrics matter to the users, design clear visual reports, automate delivery, and build configuration so each district can customize what they see. Mention Power BI as a tool you know.",
    keywords: ["automated reporting experience", "stakeholder-driven design", "per-org customization", "Power BI"]
  },
  {
    category: "Scenario",
    q: "A school district calls and says their payroll system is showing incorrect calculations right before payday. Walk us through how you'd handle this.",
    tip: "Show calm, systematic troubleshooting: First, assess severity and scope — is it one employee or district-wide? Check recent system changes or deployments. Review the data inputs and calculation logic. Communicate a timeline to the district. If it's a code bug, fix and test thoroughly before pushing. Document the root cause for the team. This tests your ability to 'respond to a rapidly changing technical environment.'",
    keywords: ["triage severity", "check recent changes", "communicate timeline", "root cause analysis", "document"]
  },
  {
    category: "Scenario",
    q: "You're asked to integrate a new Student Information System with the existing financial and HR systems. How would you plan this project?",
    tip: "Show your integration experience. Start with requirements gathering — talk to the teams who use each system. Map the data flows between systems. Design the API contracts. Build and test in a staging environment with realistic data. Plan for rollback. Reference your Keasy experience integrating Elixir, Node.js, Slack, and PostgreSQL into a cohesive system. Mention your Agile approach to breaking this into sprints.",
    keywords: ["requirements gathering", "data flow mapping", "API contracts", "staging environment", "rollback plan"]
  },
  {
    category: "Closing",
    q: "Do you have any questions for us?",
    tip: "Always ask 2-3 questions. Try: 'What does the current tech stack look like for the K-12 systems you maintain?' / 'How does the IT team interact with the school districts — tickets, embedded relationships, or something else?' / 'What would success look like in the first 6 months?' / 'Does the IT team have any connection to the CodeStack program?'",
    keywords: ["tech stack", "district interaction model", "6-month success", "CodeStack connection"]
  }
];

const categoryColors = {
  "Opening": { bg: "#FFF8E1", border: "#F9A825", text: "#F57F17", icon: "👋" },
  "Technical": { bg: "#E3F2FD", border: "#1565C0", text: "#0D47A1", icon: "⚙️" },
  "Behavioral": { bg: "#F3E5F5", border: "#7B1FA2", text: "#4A148C", icon: "🧠" },
  "Leadership": { bg: "#E8F5E9", border: "#2E7D32", text: "#1B5E20", icon: "🎯" },
  "K-12 Domain": { bg: "#FFF3E0", border: "#E65100", text: "#BF360C", icon: "🏫" },
  "Scenario": { bg: "#E0F2F1", border: "#00695C", text: "#004D40", icon: "🔍" },
  "Closing": { bg: "#FCE4EC", border: "#AD1457", text: "#880E4F", icon: "🤝" }
};

const categories = [...new Set(questions.map(q => q.category))];

export default function InterviewPrep({ onNavigate }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [practiced, setPracticed] = useState(new Set());
  const [filterCat, setFilterCat] = useState("All");

  const filtered = filterCat === "All" ? questions : questions.filter(q => q.category === filterCat);
  const safeIndex = Math.min(currentIndex, filtered.length - 1);
  const current = filtered[safeIndex];
  const colors = categoryColors[current.category];

  const markPracticed = useCallback(() => {
    const globalIdx = questions.indexOf(current);
    setPracticed(prev => {
      const next = new Set(prev);
      next.add(globalIdx);
      return next;
    });
  }, [current]);

  const next = () => {
    setShowTip(false);
    setCurrentIndex(i => (i + 1) % filtered.length);
  };

  const prev = () => {
    setShowTip(false);
    setCurrentIndex(i => (i - 1 + filtered.length) % filtered.length);
  };

  const globalIdx = questions.indexOf(current);
  const isPracticed = practiced.has(globalIdx);

  return (
    <div style={{
      fontFamily: "'Newsreader', 'Georgia', serif",
      minHeight: "100vh",
      background: "#FAFAF7",
      padding: "24px 16px",
      boxSizing: "border-box"
    }}>
      {/* Header */}
      <div style={{ maxWidth: 640, margin: "0 auto 20px" }}>
<div 
  onClick={onNavigate}
  style={{
    fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
    color: "#999", fontFamily: "monospace", marginBottom: 4,
    cursor: "pointer", textDecoration: "underline"
  }}
>Big O Study Guide</div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#1a1a1a",
          margin: "0 0 4px",
          lineHeight: 1.15
        }}>
          Interview Practice
        </h1>
        <div style={{
          fontSize: 14,
          color: "#777",
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <span>{practiced.size} of {questions.length} practiced</span>
          <span style={{
            height: 4,
            flex: 1,
            background: "#E8E8E4",
            borderRadius: 2,
            overflow: "hidden",
            maxWidth: 180
          }}>
            <span style={{
              display: "block",
              height: "100%",
              width: `${(practiced.size / questions.length) * 100}%`,
              background: "#2E7D32",
              borderRadius: 2,
              transition: "width 0.4s ease"
            }} />
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{
        maxWidth: 640,
        margin: "0 auto 20px",
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }}>
        <button
          onClick={() => { setFilterCat("All"); setCurrentIndex(0); setShowTip(false); }}
          style={{
            padding: "5px 14px",
            borderRadius: 20,
            border: filterCat === "All" ? "2px solid #1a1a1a" : "1px solid #ddd",
            background: filterCat === "All" ? "#1a1a1a" : "white",
            color: filterCat === "All" ? "white" : "#666",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >
          All ({questions.length})
        </button>
        {categories.map(cat => {
          const c = categoryColors[cat];
          const count = questions.filter(q => q.category === cat).length;
          const isActive = filterCat === cat;
          return (
            <button
              key={cat}
              onClick={() => { setFilterCat(cat); setCurrentIndex(0); setShowTip(false); }}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                border: isActive ? `2px solid ${c.border}` : "1px solid #ddd",
                background: isActive ? c.bg : "white",
                color: isActive ? c.text : "#888",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit"
              }}
            >
              {c.icon} {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <div style={{
        maxWidth: 640,
        margin: "0 auto 16px",
        background: "white",
        borderRadius: 16,
        border: `2px solid ${colors.border}22`,
        boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
        overflow: "hidden"
      }}>
        {/* Card Header */}
        <div style={{
          padding: "14px 20px",
          background: colors.bg,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${colors.border}22`
        }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: colors.text,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: "'SF Mono', 'Fira Code', monospace"
          }}>
            {colors.icon} {current.category}
          </span>
          <span style={{
            fontSize: 12,
            color: "#999",
            fontFamily: "'SF Mono', 'Fira Code', monospace"
          }}>
            {safeIndex + 1} / {filtered.length}
            {isPracticed && <span style={{ marginLeft: 8, color: "#2E7D32" }}>✓</span>}
          </span>
        </div>

        {/* Question */}
        <div style={{ padding: "28px 24px 20px" }}>
          <p style={{
            fontSize: 20,
            lineHeight: 1.5,
            color: "#1a1a1a",
            margin: 0,
            fontWeight: 500
          }}>
            "{current.q}"
          </p>
        </div>

        {/* Keywords */}
        <div style={{
          padding: "0 24px 20px",
          display: "flex",
          flexWrap: "wrap",
          gap: 6
        }}>
          {current.keywords.map((kw, i) => (
            <span key={i} style={{
              padding: "3px 10px",
              borderRadius: 4,
              background: "#F5F5F0",
              color: "#666",
              fontSize: 11,
              fontFamily: "'SF Mono', 'Fira Code', monospace"
            }}>
              {kw}
            </span>
          ))}
        </div>

        {/* Tip Toggle */}
        <div style={{ padding: "0 24px 24px" }}>
          <button
            onClick={() => { setShowTip(!showTip); if (!showTip) markPracticed(); }}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              border: `1px solid ${colors.border}44`,
              background: showTip ? colors.bg : "white",
              color: colors.text,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease"
            }}
          >
            {showTip ? "Hide coaching tip ▲" : "Show coaching tip ▼"}
          </button>

          {showTip && (
            <div style={{
              marginTop: 14,
              padding: "18px 20px",
              background: colors.bg,
              borderRadius: 10,
              borderLeft: `4px solid ${colors.border}`,
              fontSize: 14,
              lineHeight: 1.7,
              color: "#333"
            }}>
              {current.tip}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        maxWidth: 640,
        margin: "0 auto",
        display: "flex",
        gap: 10,
        justifyContent: "space-between"
      }}>
        <button onClick={prev} style={{
          flex: 1,
          padding: "12px",
          borderRadius: 10,
          border: "1px solid #ddd",
          background: "white",
          color: "#555",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit"
        }}>
          ← Previous
        </button>
        <button onClick={() => { markPracticed(); next(); }} style={{
          flex: 1,
          padding: "12px",
          borderRadius: 10,
          border: "none",
          background: "#1a1a1a",
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit"
        }}>
          Next →
        </button>
      </div>
    </div>
  );
}
