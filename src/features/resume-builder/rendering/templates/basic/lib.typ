#import "helpers.typ": normalize-url


#let get(dict, key, default: "") = {
  if dict == none or type(dict) != dictionary {
    default
  } else {
    let val = dict.at(key, default: default)
    if val == none {
      default
    } else {
      val
    }
  }
}

#let get-value(dict, key, default: none) = {
  if dict == none or type(dict) != dictionary {
    default
  } else {
    let val = dict.at(key, default: default)
    if val == none {
      default
    } else {
      val
    }
  }
}

#let resume(
  author: "",
  author-position: left,
  personal-info-position: left,
  pronouns: "",
  location: "",
  email: "",
  github: "",
  linkedin: "",
  phone: "",
  personal_site: "",
  orcid: "",
  accent-color: "#0f172a",
  font: "New Computer Modern",
  paper: "us-letter",
  author-font-size: 20pt,
  font-size: 10pt,
  lang: "en",
  body,
) = {
  // Sets document metadata
  set document(author: author, title: author)

  // Document-wide formatting, including font and margins
  set text(
    font: font,
    size: font-size,
    lang: lang,
  )

  // Recommended 0.4in margin
  set page(
    margin: (0.4in),
    paper: paper,
  )

  // Link styles
  show link: underline

  // Section heading styling
  show heading.where(level: 2): it => [
    #pad(top: 0pt, bottom: -10pt, [#smallcaps(it.body)])
    #line(length: 100%, stroke: 1pt)
  ]

  // Accent Color Styling
  show heading: set text(
    fill: rgb(accent-color),
  )

  show link: set text(
    fill: rgb(accent-color),
  )

  // Main body
  set par(justify: true)

  body
}

// Generic two by two component for resume
#let generic-two-by-two(
  top-left: "",
  top-right: "",
  bottom-left: "",
  bottom-right: "",
) = {
  [
    #top-left #h(1fr) #top-right \
    #bottom-left #h(1fr) #bottom-right
  ]
}

// Generic one by two component for resume
#let generic-one-by-two(
  left: "",
  right: "",
) = {
  [
    #left #h(1fr) #right
  ]
}

// Dates helper
#let dates-helper(
  start-date: "",
  end-date: "",
) = {
  let s = if start-date == none { "" } else { str(start-date) }
  let e = if end-date == none { "" } else { str(end-date) }

  if s == "" and e == "" {
    ""
  } else if s == "" {
    e
  } else if e == "" {
    s
  } else {
    s + " " + sym.dash.em + " " + e
  }
}

// Section components below
#let edu(
  institution: "",
  dates: "",
  degree: "",
  gpa: "",
  location: "",
  consistent: false,
) = {
  if consistent {
    generic-two-by-two(
      top-left: strong(institution),
      top-right: dates,
      bottom-left: emph(degree),
      bottom-right: emph(location),
    )
  } else {
    generic-two-by-two(
      top-left: strong(institution),
      top-right: location,
      bottom-left: emph(degree),
      bottom-right: emph(dates),
    )
  }
}

#let work(
  title: "",
  dates: "",
  company: "",
  location: "",
) = {
  generic-two-by-two(
    top-left: strong(title),
    top-right: dates,
    bottom-left: company,
    bottom-right: emph(location),
  )
}

#let project(
  role: "",
  name: "",
  github: "",
  demo: "",
  dates: "",
) = {
  generic-one-by-two(
    left: {
      let title = if role == "" { [*#name*] } else { [*#role*, #name] }

      let links = (
        if github != none and github != "" {
          link(normalize-url(github))[Github]
        },
        if demo != none and demo != "" {
          link(normalize-url(demo))[Demo]
        },
      )

      if links.filter(x => x != none).len() > 0 {
        [#title (#links.filter(x => x != none).join(" | "))]
      } else {
        title
      }
    },
    right: {
      dates
    },
  )
}

#let certificates(
  name: "",
  issuer: "",
  url: "",
  date: "",
) = {
  [
    *#name*, #issuer
    #if url != "" {
      [ (#link("https://" + url)[#url])]
    }
    #h(1fr) #date
  ]
}

#let extracurriculars(
  activity: "",
  dates: "",
) = {
  generic-one-by-two(
    left: strong(activity),
    right: dates,
  )
}
