// -----------------------------------------------------------------------------
// Generic Helpers
// -----------------------------------------------------------------------------

#let is-empty(value) = {
  value == none or value == ""
}

#let not-empty(value) = {
  not is-empty(value)
}

#let safe(value, fallback: "") = {
  if is-empty(value) {
    fallback
  } else {
    value
  }
}

#let normalize-url(url) = {
  if url.starts-with("http://") or url.starts-with("https://") {
    url
  } else {
    "https://" + url
  }
}

#let date-range(
  start,
  end,
) = {
  if is-empty(start) and is-empty(end) {
    ""
  } else if is-empty(end) {
    start
  } else if is-empty(start) {
    end
  } else {
    start + " – " + end
  }
}

#let bullet(body) = [
  • #body
]

#let divider(
  color: rgb("#d1d5db"),
  thickness: 0.6pt,
) = {
  line(
    length: 100%,
    stroke: thickness + color,
  )
}

#let external-link(
  url,
  label,
) = {
  if not-empty(url) [
    #link(normalize-url(url))[#label]
  ]
}

#let join(
  items,
  separator: " • ",
) = {

  let filtered = items.filter(x => x != none and x != "")

  filtered.join(separator)

}
