#import "../lib.typ": *
#import "../helpers.typ": not-empty

#let achievements-section(resume) = {
  let items = get-value(resume, "achievements", default: ())
  if items == none or type(items) != array or items.len() == 0 {
    return
  }

  [
    == Achievements

    #for achievement in items [
     #grid(
        columns: (4fr, auto),
        column-gutter: 0.5em,
        [
          #strong[#get(achievement, "title")]
        ],
        [
          #get(achievement, "date")
        ],
      )

      #v(-0.5em)

      #let description = get(achievement, "description")
      #if not-empty(description) [
        #description
      ]
    ]
  ]
}

