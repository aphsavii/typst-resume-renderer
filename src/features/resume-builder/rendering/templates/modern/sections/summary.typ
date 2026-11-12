#import "../lib.typ": get
#import "../helpers.typ": not-empty

#let summary-section(data) = {
  let summary = get(data, "summary")
  if not-empty(summary) [
    == Summary

    #summary
  ]
}

