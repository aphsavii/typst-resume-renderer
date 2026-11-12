#import "../lib.typ": *

#let certifications-section(resume) = {
  let certList = get-value(resume, "certifications", default: ())
  if certList == none or type(certList) != array or certList.len() == 0 {
    return
  }
  [
    == Certifications
    #for cert in certList [
      #certificates(
        name: get(cert, "name"),
        issuer: get(cert, "issuer"),
        url: get(cert, "credentialUrl", default: get(cert, "url")),
        date: get(cert, "issueDate"),
      )
      #linebreak()
    ]
  ]
}

