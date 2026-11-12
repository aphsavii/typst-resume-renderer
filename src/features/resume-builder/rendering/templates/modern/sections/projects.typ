#import "../lib.typ": *

#let projects-section(resume) = {
  let projectsList = get-value(resume, "projects", default: ())
  if projectsList == none or projectsList.len() == 0 {
    return
  }

  [
    == Projects

    #for projectItem in projectsList [
      #let dur = get-value(projectItem, "duration")
      #let startDate = if type(dur) == dictionary { get(dur, "start") } else { "" }
      #let endDate = if type(dur) == dictionary { get(dur, "end") } else { "" }

      #project(
        role: "",
        name: get(projectItem, "name"),
        github: get(projectItem, "github"),
        demo: get(projectItem, "demo"),
        dates: dates-helper(
          start-date: startDate,
          end-date: endDate,
        ),
      )
      #linebreak()
      #let techs = get-value(projectItem, "technologies", default: ())
      #if type(techs) == array and techs.len() > 0 [
        #emph[#techs.join(", ")]
      ]
      #let hls = get-value(projectItem, "highlights", default: ())
      #if type(hls) == array [
        #for point in hls [
          - #point
        ]
      ]

    ]
  ]
}
