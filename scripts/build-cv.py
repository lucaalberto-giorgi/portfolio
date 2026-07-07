"""Generate public/luca-alberto-giorgi-cv.pdf.

Usage:
    python3 -m venv .venv && .venv/bin/pip install reportlab
    .venv/bin/python scripts/build-cv.py

The layout mirrors the original CV design (no section rules, Helvetica,
compact 42pt margins) on an A4 page.
"""

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
)

OUT = Path(__file__).resolve().parent.parent / "public" / "luca-alberto-giorgi-cv.pdf"

LINK = "#0563C1"
MARGIN = 42  # pt

doc = SimpleDocTemplate(
    str(OUT),
    pagesize=A4,
    leftMargin=MARGIN,
    rightMargin=MARGIN,
    topMargin=MARGIN,
    bottomMargin=MARGIN,
    title="Luca Alberto Giorgi - CV",
    author="Luca Alberto Giorgi",
)

title_style = ParagraphStyle(
    "Title", fontName="Helvetica-Bold", fontSize=16, leading=19,
    alignment=TA_CENTER, spaceAfter=3,
)
contact_style = ParagraphStyle(
    "Contact", fontName="Helvetica", fontSize=9, leading=11.5,
    alignment=TA_CENTER,
)
section_style = ParagraphStyle(
    "Section", fontName="Helvetica-Bold", fontSize=11, leading=13,
    spaceBefore=11, spaceAfter=4,
)
body_style = ParagraphStyle(
    "Body", fontName="Helvetica", fontSize=9, leading=11.2,
)
job_title_style = ParagraphStyle(
    "JobTitle", fontName="Helvetica-Bold", fontSize=9.5, leading=11.5,
    spaceBefore=4, spaceAfter=2,
)
bullet_style = ParagraphStyle(
    "Bullet", fontName="Helvetica", fontSize=9, leading=11.2,
    spaceAfter=1.5,
)


def section(title):
    return [Paragraph(title, section_style)]


def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(t, bullet_style), leftIndent=4, value="•") for t in items],
        bulletType="bullet", leftIndent=12, spaceBefore=0, spaceAfter=3,
        bulletFontSize=9,
    )


def link(href, text=None):
    return f'<link href="{href}"><font color="{LINK}">{text or href}</font></link>'


story = []

story.append(Paragraph("LUCA ALBERTO GIORGI", title_style))
story.append(Paragraph(
    "London, UK | +44 7424 972391 | "
    + link("mailto:lucalberto.giorgi2004@gmail.com", "lucalberto.giorgi2004@gmail.com"),
    contact_style,
))
story.append(Paragraph(
    f'Portfolio: {link("https://lucagiorgi.com")} | '
    f'GitHub: {link("https://github.com/lucaalberto-giorgi")} | '
    f'LinkedIn: {link("https://linkedin.com/in/luca-alberto-giorgi", "linkedin.com/in/luca-alberto-giorgi")}',
    contact_style,
))

story += section("PROFILE")
story.append(Paragraph(
    "Frontend-focused Software Engineer and First-Class Computer Science graduate from the University of East "
    "London. Experienced in building full-stack applications using React and FastAPI, with a focus on responsive "
    "UI, API integration, and clean, maintainable code. Actively seeking a frontend or full-stack junior role in "
    "London.",
    body_style,
))

story += section("PROFESSIONAL EXPERIENCE")
story.append(Paragraph(
    "Software Development Intern | Affinity (Shipping) LLP, London | May 2026 &ndash; June 2026",
    job_title_style,
))
story.append(bullets([
    "Built an AI editorial feature that turns research-report PDFs into multi-section web briefings, from "
    "back-office generation and editing to publishing and a public reader, with source-grounded output and "
    "prompt-injection hardening.",
    "Designed and shipped a hiring/applicant-tracking workflow: candidate detail pages with HR notes, AI "
    "CV-to-job scoring with guardrails, automated confirmation emails, and routing of website applications into "
    "a trackable pipeline.",
    "Replaced an off-site third-party form with a native customer-feedback feature (React + Supabase) integrated "
    "into a new back-office tab.",
    "Ran a codebase audit and security review on joining, documenting findings with reproduction steps, and "
    "authored engineering documentation plus a service-cost analysis.",
]))
story.append(Paragraph(
    "<b>Tech used:</b> React, TypeScript, Next.js, FastAPI/Python, Supabase, Sanity, LLM integration, REST APIs.",
    ParagraphStyle("TechUsed", parent=bullet_style, leftIndent=12),
))

story += section("PROJECT EXPERIENCE")

story.append(Paragraph("AI-Powered CV Matching System | Full-Stack Project - London | 2026", job_title_style))
story.append(bullets([
    "Built a full-stack CV/job-matching tool (React + Vite, FastAPI) that scores a candidate's CV against a job "
    "description in real time.",
    "Extracted CV text from uploaded PDFs and generated OpenAI embeddings to compute semantic + keyword match "
    "scores.",
    "Surfaced matched/missing skills and an AI-generated rationale alongside the overall score.",
]))

story.append(Paragraph("Forma | Full-Stack Web Application - London | 2026", job_title_style))
story.append(bullets([
    "Built a personalised training and nutrition planner (Next.js, React, TypeScript, Tailwind CSS) that turns a "
    "short questionnaire into a complete weekly training plan.",
    "Wrote the nutrition engine from scratch (BMR, TDEE, goal-based calorie and macro targets) and generated "
    "meal suggestions with Claude models via OpenRouter, shipping the interface in four languages.",
]))

story.append(Paragraph("Receipt Flow | Full-Stack Web Application - London | 2026", job_title_style))
story.append(bullets([
    "Built an AI-powered receipt-processing and expense-tracking app (React + Vite, FastAPI) with OpenAI-based "
    "structured data extraction from uploaded receipts.",
    "Implemented auto-categorisation, analytics, and CSV export across a shared expense workspace with "
    "real-time dashboard updates.",
    "Focused on UX resilience with error handling, loading, and empty states across the upload and review flow.",
]))

story.append(Paragraph("Personal Portfolio Website | Front-End Project - London | 2026", job_title_style))
story.append(bullets([
    "Built and designed a personal portfolio (Next.js, TypeScript, Tailwind CSS, Motion) with a sticky split "
    "layout, animated intro, dark mode, and a live GitHub-activity graph.",
    "Focused on performance and accessibility, including optimised images, reduced-motion support, and "
    "keyboard-navigable markup.",
]))

story += section("EDUCATION")
story.append(Paragraph(
    "University of East London - BSc (Hons) Computer Science - First-Class Honours | Jan 2024 - Jun 2026",
    job_title_style,
))
story.append(bullets([
    "Final-Year Project / Dissertation: 95/100.",
    "Relevant Modules: Software Development (98), Computer &amp; Network Security (93), Data Structures &amp; "
    "Algorithms (89), Web &amp; Mobile Application Development (87), Database Systems (84), Advanced Topics in "
    "Computer Science (84), Artificial Intelligence (82).",
]))

story += section("SKILLS")
story.append(bullets([
    "<b>Frontend:</b> JavaScript (ES6+), React, TypeScript, HTML, CSS, Tailwind CSS, Vite",
    "<b>Backend:</b> FastAPI (Python), REST APIs",
    "<b>Tools:</b> Git, GitHub, Supabase, Sanity, Next.js",
    "<b>AI:</b> LLM integration, OpenAI API, NLP fundamentals",
]))

doc.build(story)
print(f"wrote {OUT}")
