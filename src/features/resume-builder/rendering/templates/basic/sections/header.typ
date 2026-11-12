#import "../components.typ": *
#import "../helpers.typ": *
#import "../lib.typ": get, get-value

#let header(resume) = [
#set align(center)
#let personal = get-value(resume, "personal", default: (:))
= #get(personal, "name")

#let contact-items = (
  get(personal, "email"),
  get(personal, "phone"),
  get(personal, "location"),
).filter(x => x != none and x != "")

#if contact-items.len() > 0 [
  #contact-row(contact-items)
]

#let links = ()
#let linkedin = get(personal, "linkedin")
#if not-empty(linkedin) { links.push(external-link(linkedin, "LinkedIn")) }
#let github = get(personal, "github")
#if not-empty(github) { links.push(external-link(github, "GitHub")) }
#let website = get(personal, "website")
#if not-empty(website) { links.push(external-link(website, "Portfolio")) }

#let customLinks = get-value(personal, "customLinks", default: ())
#if customLinks != none and type(customLinks) == array [
  #for cl in customLinks [
    #let cl-url = get(cl, "url")
    #if not-empty(cl-url) [
      #let cl-label = get(cl, "label", default: "Link")
      #let label = if not-empty(cl-label) { cl-label } else { "Link" }
      #links.push(external-link(cl-url, label))
    ]
  ]
]

#if links.len() > 0 [
  #v(1pt)
  #link-row(links)
]

#set align(left)

]

