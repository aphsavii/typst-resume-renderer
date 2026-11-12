#import "../lib.typ": *

#let experience-section(resume) = {
  let expList = get-value(resume, "experience", default: ())
  if expList == none or type(expList) != array or expList.len() == 0 {
    return
  }

  [
    == Experience

    #for exp in expList [
      #let title = get(exp, "position")
      #let company = get(exp, "company")
      #let location = get(exp, "location")
      #let startDate = get(exp, "startDate")
      #let endDate = get(exp, "endDate", default: "Present")

      #work(
        title: title,
        company: company,
        location: location,
        dates: dates-helper(
          start-date: startDate,
          end-date: endDate,
        ),
      )
      #let hls = get-value(exp, "highlights", default: ())
      #if type(hls) == array [
        #for point in hls [
          - #point
        ]
      ]
    ]
  ]
}

