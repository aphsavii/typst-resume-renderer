#import "lib.typ": *
#import "adapter.typ": *
#import "sections/header.typ": header

// Prefer data injected by the host (the CLI passes `--input resume=<json>`).
// Fall back to the shadowed file used by the browser compiler.
#let data = if sys.inputs.at("resume", default: "") != "" {
  json.decode(sys.inputs.resume)
} else {
  json("resume.json")
}

#let personal = get-value(data, "personal", default: (:))

#show: resume.with(
  author: get(personal, "name"),
  email: get(personal, "email"),
  phone: get(personal, "phone"),
  location: get(personal, "location"),
  github: get(personal, "github"),
  linkedin: get(personal, "linkedin"),
  personal_site: get(personal, "website"),
)

#header(data)

#let default-order = ("summary", "skills", "experience", "projects", "education", "certifications", "achievements", "leadership", "publications", "customSections")
#let raw-order = get-value(data, "sectionOrder", default: default-order)
#let order = if raw-order == none or type(raw-order) != array or raw-order.len() == 0 { default-order } else { raw-order }

#for sec in order [
  #if sec == "summary" [ #summary-section(data) ]
  #if sec == "skills" [ #skills-section(data) ]
  #if sec == "experience" [ #experience-section(data) ]
  #if sec == "projects" [ #projects-section(data) ]
  #if sec == "education" [ #education-section(data) ]
  #if sec == "certifications" [ #certifications-section(data) ]
  #if sec == "achievements" [ #achievements-section(data) ]
  #if sec == "leadership" [ #leadership-section(data) ]
  #if sec == "publications" [ #publications-section(data) ]
  #if sec == "customSections" [ #custom-section(data) ]
]

