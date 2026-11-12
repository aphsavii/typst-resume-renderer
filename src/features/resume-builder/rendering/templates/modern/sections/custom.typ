#import "../lib.typ": *
#import "../helpers.typ": not-empty

#let custom-section(resume) = {
  let custom-sections = get-value(resume, "customSections", default: ())
  if custom-sections == none or type(custom-sections) != array or custom-sections.len() == 0 {
    return
  }

  for sec in custom-sections {
    let title = get(sec, "title", default: "Additional Section")
    let items = get-value(sec, "items", default: ())
    if items != none and type(items) == array and items.len() > 0 [
      == #title

      #for item in items [
        #work(
          title: get(item, "title"),
          company: get(item, "subtitle"),
          location: get(item, "location"),
          dates: get(item, "date"),
        )
        #let desc = get(item, "description")
        #if not-empty(desc) [
          - #desc
        ]
      ]
    ]
  }
}

