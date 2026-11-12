#import "../components.typ": section
#import "../lib.typ": get, get-value

#let skills-section(resume) = {
  let skillsList = get-value(resume, "skills", default: ())
  if skillsList == none or type(skillsList) != array or skillsList.len() == 0 {
    return
  }

  section("Skills", [
    #for category in skillsList [
      #let catName = get(category, "category", default: "Skills")
      #let itemsList = get-value(category, "items", default: ())
      #let itemsStr = if type(itemsList) == array { itemsList.join(", ") } else { str(itemsList) }
      - *#catName:* #itemsStr
    ]
  ])
}

