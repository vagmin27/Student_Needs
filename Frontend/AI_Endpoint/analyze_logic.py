import re
import requests
import numpy as np
from collections import defaultdict, Counter
from sklearn.preprocessing import MinMaxScaler
import fitz  # PyMuPDF


# =========================
# SKILL CONFIDENCE THRESHOLDS
# =========================
SKILL_PRESENT_THRESHOLD = 0.1
SKILL_SUFFICIENT_THRESHOLD = 5.0


# =========================
# SKILL ONTOLOGY
# =========================
SKILL_ONTOLOGY = {
    "programming_languages": [
        "python","java","c","c++","javascript","typescript","go",
        "ruby","php","scala","kotlin","swift","r"
    ],
    "web_development": [
        "html","css","scss","react","angular","vue",
        "node","express","nextjs","django","flask","spring"
    ],
    "databases": [
        "mysql","postgresql","mongodb","redis",
        "sqlite","oracle","cassandra"
    ],
    "data_science_ml": [
        "numpy","pandas","scikit-learn","tensorflow","pytorch",
        "keras","nlp","computer vision","statistics",
        "machine learning","deep learning"
    ],
    "devops_cloud": [
        "docker","kubernetes","aws","azure","gcp",
        "jenkins","terraform","ci/cd"
    ],
    "tools_platforms": [
        "git","github","gitlab","jupyter",
        "linux","bash","postman"
    ],
    "soft_skills": [
        "problem solving","communication",
        "teamwork","leadership","critical thinking"
    ]
}


# =========================
# JOB ROLES
# =========================
JOB_ROLES = {
    "Software Engineer (General)": {
        "python":0.15,"java":0.15,"data structures":0.2,
        "algorithms":0.2,"databases":0.15,"git":0.15
    },
    "Backend Developer": {
        "python":0.2,"java":0.2,"databases":0.2,
        "apis":0.2,"docker":0.1,"cloud":0.1
    },
    "Frontend Developer": {
        "javascript":0.25,"react":0.25,
        "html":0.2,"css":0.2,"typescript":0.1
    },
    "Full Stack Developer": {
        "javascript":0.2,"python":0.2,
        "react":0.2,"databases":0.2,
        "apis":0.1,"docker":0.1
    },
    "Data Analyst": {
        "sql":0.3,"excel":0.2,"statistics":0.2,
        "python":0.2,"data visualization":0.1
    },
    "Data Scientist": {
        "python":0.3,"machine learning":0.25,
        "statistics":0.2,"pandas":0.15,"sql":0.1
    },
    "Machine Learning Engineer": {
        "python":0.25,"machine learning":0.25,
        "tensorflow":0.15,"pytorch":0.15,
        "docker":0.1,"cloud":0.1
    },
    "AI Engineer": {
        "python":0.3,"deep learning":0.25,
        "nlp":0.15,"computer vision":0.15,
        "ml deployment":0.15
    },
    "DevOps Engineer": {
        "docker":0.25,"kubernetes":0.25,
        "ci/cd":0.2,"cloud":0.2,"linux":0.1
    }
}


# =========================
# PDF UTILITIES
# =========================
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text.lower()


def normalize_text(text):
    text = re.sub(r"[^a-zA-Z0-9+/.\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.lower()


# =========================
# SKILL EXTRACTION
# =========================
def extract_skills_nlp(text):
    skill_scores = defaultdict(float)

    for skills in SKILL_ONTOLOGY.values():
        for skill in skills:
            pattern = r"\b" + re.escape(skill) + r"\b"
            matches = re.findall(pattern, text)
            if matches:
                skill_scores[skill] += len(matches)

    return dict(skill_scores)


# =========================
# GITHUB PARSER (NO TOKEN)
# =========================
def parse_github_profile(github_url):
    username = github_url.rstrip("/").split("/")[-1]
    api_url = f"https://api.github.com/users/{username}/repos"

    repos = requests.get(api_url).json()
    lang_counter = Counter()
    text_blob = ""

    if isinstance(repos, list):
        for repo in repos:
            if repo.get("language"):
                lang_counter[repo["language"].lower()] += 1
            text_blob += " " + (repo.get("description") or "")

    return lang_counter, text_blob.lower()


# =========================
# MERGE ALL SOURCES
# =========================
def merge_skill_sources(resume, linkedin, github_langs, github_text):
    combined_text = resume + " " + linkedin + " " + github_text
    skills = defaultdict(float)

    extracted = extract_skills_nlp(combined_text)
    for k, v in extracted.items():
        skills[k] += v

    for lang, count in github_langs.items():
        skills[lang] += count * 2

    return dict(skills)


# =========================
# NORMALIZATION
# =========================
def normalize_skills(skill_scores):
    if not skill_scores:
        return {}

    scaler = MinMaxScaler(feature_range=(0, 10))
    values = np.array(list(skill_scores.values()), dtype=float).reshape(-1, 1)
    scaled = scaler.fit_transform(values)

    return {
        skill: round(float(score[0]), 2)
        for skill, score in zip(skill_scores.keys(), scaled)
        if score[0] > 0
    }


# =========================
# JOB COMPATIBILITY
# =========================
def job_compatibility(skill_scores, target_role):
    role_skills = JOB_ROLES[target_role]
    score = 0.0
    missing = []
    weak = []

    for skill, weight in role_skills.items():
        val = skill_scores.get(skill, 0)

        if val >= SKILL_SUFFICIENT_THRESHOLD:
            score += weight
        elif val >= SKILL_PRESENT_THRESHOLD:
            score += (val / 10) * weight
            weak.append(skill)
        else:
            missing.append(skill)

    return round(score * 100, 2), missing, weak


# =========================
# ADVISORY GENERATOR
# =========================
def advisory_sentences(missing_skills, weak_skills, role):
    messages = []

    if missing_skills:
        messages.append(
            f"To strengthen alignment with the {role} role, the candidate should acquire foundational knowledge in "
            + ", ".join(missing_skills) + "."
        )

    if weak_skills:
        messages.append(
            f"Improving hands-on experience in "
            + ", ".join(weak_skills)
            + " would significantly enhance job readiness."
        )

    if not missing_skills and not weak_skills:
        messages.append(
            f"The candidate demonstrates strong alignment with the skill expectations for the {role} role."
        )

    return messages


# =========================
# MAIN ENTRY FUNCTION
# =========================
def analyze_candidate(resume_pdf, linkedin_pdf, github_url, target_role):
    resume_text = normalize_text(extract_text_from_pdf(resume_pdf))
    linkedin_text = normalize_text(extract_text_from_pdf(linkedin_pdf))

    github_langs, github_text = parse_github_profile(github_url)

    raw_skills = merge_skill_sources(
        resume_text, linkedin_text, github_langs, github_text
    )

    normalized_skills = normalize_skills(raw_skills)

    compatibility, missing, weak = job_compatibility(
        normalized_skills, target_role
    )

    return {
        "key_skills": normalized_skills,
        "job_role": target_role,
        "compatibility_score_percent": compatibility,
        "missing_skills": missing,
        "weak_skills": weak,
        "advisory": advisory_sentences(missing, weak, target_role)
    }