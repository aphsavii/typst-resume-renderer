#import "../lib.typ": *
#import "../helpers.typ": not-empty

#let publications-section(resume) = {
  let items = get-value(resume, "publications", default: ())
  if items == none or type(items) != array or items.len() == 0 {
    return
  }

  [
    == Publications & Research

    #for pub in items [
      #let title = get(pub, "title")
      #let publisher = get(pub, "publisher")
      #let url = get(pub, "url")
      #let date = get(pub, "date")
      #let summary = get(pub, "summary")

      #certificates(
        name: title,
        issuer: publisher,
        url: url,
        date: date,
      )
      #if not-empty(summary) [
        #v(-4pt)
        #text(size: 9pt, fill: rgb("#475569"))[#summary]
        #v(4pt)
      ]
    ]
  ]
}

