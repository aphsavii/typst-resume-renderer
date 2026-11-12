#import "../lib.typ": *
#import "../helpers.typ": not-empty

#let education-section(resume) = {
  let eduList = get-value(resume, "education", default: ())
  if eduList == none or type(eduList) != array or eduList.len() == 0 {
    return
  }

  [
    == Education
    #for item in eduList [
      #let institution = get(item, "institution")
      #let degree = get(item, "degree")
      #let field = get(item, "field")
      #let location = get(item, "location")
      #let startDate = get(item, "startDate")
      #let endDate = get(item, "endDate")
      #let cgpa = get(item, "cgpa")
      #let percentage = get(item, "percentage")

      #let fullDegree = if not-empty(field) { degree + ", " + field } else { degree }

      #edu(
        institution: institution,
        degree: fullDegree,
        location: location,
        dates: dates-helper(
          start-date: startDate,
          end-date: endDate,
        ),
        consistent: true,
      )
      #if not-empty(cgpa) [
        GPA: #cgpa
      ]
      #if not-empty(percentage) [
        Percentage: #percentage
      ]

    ]
  ]
}

