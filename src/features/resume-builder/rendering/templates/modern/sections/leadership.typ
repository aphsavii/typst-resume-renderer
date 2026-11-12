#import "../lib.typ": *

#let leadership-section(resume) = {
  let items = get-value(resume, "leadership", default: ())
  if items == none or type(items) != array or items.len() == 0 {
    return
  }

  [
    == Leadership & Responsibility

    #for item in items [
      #let title = get(item, "title")
      #let org = get(item, "organization")
      #let loc = get(item, "location")
      #let startDate = get(item, "startDate")
      #let endDate = get(item, "endDate", default: "Present")

      #work(
        title: title,
        company: org,
        location: loc,
        dates: dates-helper(
          start-date: startDate,
          end-date: endDate,
        ),
      )
      #let hls = get-value(item, "highlights", default: ())
      #if hls != none and type(hls) == array [
        #for point in hls [
          - #point
        ]
      ]
    ]
  ]
}

