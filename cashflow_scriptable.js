// CASH FLOW WIDGET - All sizes in one script
// Small = compact 4-stat card
// Medium = lock screen style
// Large = full dashboard with months and debt tracker

const data = {
  months: ["May", "Jun", "Jul", "Aug"],
  income: [8800, 7500, 6670, 7000],
  obligations: [6200, 6600, 5580, 3500],
  debts: [
    { name: "Beto",      total: 3380,  paid: 3380,  color: "#ffd166" },
    { name: "Kris",      total: 3000,  paid: 3000,  color: "#c9b1ff" },
    { name: "Anthony V", total: 4250,  paid: 2000,  color: "#6eb4ff" },
    { name: "Jason",     total: 73050, paid: 21550, color: "#ff6b6b" },
  ]
}

const nets = data.months.map(function(m, i) { return data.income[i] - data.obligations[i] })
const totalIn = data.income.reduce(function(a, b) { return a + b }, 0)
const totalOut = data.obligations.reduce(function(a, b) { return a + b }, 0)
const totalNet = totalIn - totalOut

var running = 0
const balances = nets.map(function(n) { running += n; return running })

const C = {
  bg:     new Color("#080a09"),
  bg2:    new Color("#0f110f"),
  bg3:    new Color("#1c1f1c"),
  border: new Color("#1e221e"),
  text:   new Color("#eceeed"),
  text2:  new Color("#7a8079"),
  text3:  new Color("#404540"),
  green:  new Color("#5dfc8d"),
  red:    new Color("#ff6b6b"),
  blue:   new Color("#6eb4ff"),
  accent: new Color("#c4f135"),
  yellow: new Color("#ffd166"),
  purple: new Color("#c9b1ff"),
}

function fmt(n) {
  var abs = Math.abs(Math.round(n))
  var str = abs >= 1000 ? (abs / 1000).toFixed(1) + "k" : abs.toString()
  return (n < 0 ? "-$" : "$") + str
}

function fmtFull(n) {
  var abs = Math.abs(Math.round(n))
  var str = abs.toLocaleString()
  return (n < 0 ? "-$" : "$") + str
}

function addDebtRow(parent, debt) {
  var pct = Math.min(debt.paid / debt.total, 1)
  var remaining = Math.max(debt.total - debt.paid, 0)
  var cleared = remaining === 0
  var dc = new Color(debt.color)

  var row = parent.addStack()
  row.layoutHorizontally()
  row.centerAlignContent()

  var name = row.addText(debt.name)
  name.textColor = dc
  name.font = Font.semiboldSystemFont(10)
  name.minimumScaleFactor = 0.7

  row.addSpacer()

  var pctText = row.addText(Math.round(pct * 100) + "%")
  pctText.textColor = dc
  pctText.font = Font.boldSystemFont(10)

  row.addSpacer(6)

  var rem = row.addText(cleared ? "CLEARED" : fmtFull(remaining) + " left")
  rem.textColor = cleared ? C.green : C.text3
  rem.font = Font.systemFont(9)
  rem.minimumScaleFactor = 0.7

  parent.addSpacer(3)

  var barBg = parent.addStack()
  barBg.backgroundColor = C.bg3
  barBg.cornerRadius = 2
  barBg.setPadding(0, 0, 0, 0)

  var barWidth = Math.round(pct * 26)
  var emptyWidth = 26 - barWidth
  var filled = barWidth > 0 ? Array(barWidth + 1).join("|") : ""
  var empty = emptyWidth > 0 ? Array(emptyWidth + 1).join(" ") : ""

  var fill = barBg.addText(filled)
  fill.textColor = dc
  fill.font = Font.systemFont(5)
  fill.lineLimit = 1

  var emptyText = barBg.addText(empty)
  emptyText.textColor = C.bg3
  emptyText.font = Font.systemFont(5)

  parent.addSpacer(5)
}

// ── SMALL WIDGET ──
function buildSmall(widget) {
  widget.setPadding(12, 12, 12, 12)

  var header = widget.addStack()
  header.layoutHorizontally()
  header.centerAlignContent()

  var dot = header.addText("*")
  dot.textColor = C.accent
  dot.font = Font.boldSystemFont(8)

  header.addSpacer(4)

  var title = header.addText("CASH FLOW")
  title.textColor = C.text
  title.font = Font.boldSystemFont(10)
  title.minimumScaleFactor = 0.8

  header.addSpacer()

  var period = header.addText("May-Aug")
  period.textColor = C.text3
  period.font = Font.systemFont(8)

  widget.addSpacer(8)

  var cards = widget.addStack()
  cards.layoutHorizontally()
  cards.spacing = 6

  function miniCard(parent, label, value, color) {
    var card = parent.addStack()
    card.layoutVertically()
    card.backgroundColor = C.bg2
    card.cornerRadius = 8
    card.setPadding(7, 8, 7, 8)
    var l = card.addText(label)
    l.textColor = C.text3
    l.font = Font.systemFont(7)
    l.minimumScaleFactor = 0.7
    var v = card.addText(value)
    v.textColor = color
    v.font = Font.boldSystemFont(13)
    v.minimumScaleFactor = 0.7
  }

  miniCard(cards, "NET", fmt(totalNet), C.green)
  cards.addSpacer(6)
  miniCard(cards, "BAL", fmt(balances[balances.length - 1]), C.blue)

  widget.addSpacer(6)

  var cards2 = widget.addStack()
  cards2.layoutHorizontally()
  cards2.spacing = 6

  miniCard(cards2, "JASON", fmt(73050 - 21550), C.red)
  cards2.addSpacer(6)
  miniCard(cards2, "AUG", fmt(nets[3]), C.green)

  widget.addSpacer()
}

// ── MEDIUM WIDGET (Lock screen style) ──
function buildMedium(widget) {
  widget.setPadding(14, 14, 14, 14)

  var header = widget.addStack()
  header.layoutHorizontally()
  header.centerAlignContent()

  var dot = header.addText("*")
  dot.textColor = C.accent
  dot.font = Font.boldSystemFont(9)
  header.addSpacer(5)

  var titleStack = header.addStack()
  titleStack.layoutVertically()
  var title = titleStack.addText("CASH FLOW")
  title.textColor = C.text
  title.font = Font.boldSystemFont(12)
  var sub = titleStack.addText("May - Aug 2026")
  sub.textColor = C.text3
  sub.font = Font.systemFont(9)

  header.addSpacer()

  var jasonStack = header.addStack()
  jasonStack.layoutVertically()
  var jl = jasonStack.addText("JASON")
  jl.textColor = C.text3
  jl.font = Font.systemFont(8)
  jl.rightAlignText()
  var jv = jasonStack.addText(fmtFull(73050 - 21550))
  jv.textColor = C.red
  jv.font = Font.boldSystemFont(12)
  jv.rightAlignText()

  widget.addSpacer(10)

  var strips = widget.addStack()
  strips.layoutHorizontally()
  strips.spacing = 8

  function strip(parent, label, value, color, sub2) {
    var s = parent.addStack()
    s.layoutVertically()
    s.backgroundColor = C.bg2
    s.cornerRadius = 10
    s.setPadding(8, 10, 8, 10)
    var l = s.addText(label)
    l.textColor = C.text3
    l.font = Font.systemFont(8)
    var v = s.addText(value)
    v.textColor = color
    v.font = Font.boldSystemFont(14)
    var s2 = s.addText(sub2)
    s2.textColor = C.text3
    s2.font = Font.systemFont(8)
  }

  strip(strips, "NET", fmt(nets[0]), C.green, "May")
  strip(strips, "BALANCE", fmt(balances[balances.length - 1]), C.blue, "running")
  strip(strips, "4-MO", fmt(totalNet), totalNet >= 0 ? C.green : C.red, "total")

  widget.addSpacer(10)

  data.debts.forEach(function(debt) {
    var pct = Math.min(debt.paid / debt.total, 1)
    var cleared = debt.paid >= debt.total
    var dc = new Color(debt.color)

    var row = widget.addStack()
    row.layoutHorizontally()
    row.centerAlignContent()

    var n = row.addText(debt.name)
    n.textColor = dc
    n.font = Font.semiboldSystemFont(10)
    row.addSpacer()
    var p = row.addText(cleared ? "CLEARED" : Math.round(pct * 100) + "%")
    p.textColor = cleared ? C.green : dc
    p.font = Font.boldSystemFont(10)

    widget.addSpacer(3)

    var barStack = widget.addStack()
    barStack.backgroundColor = C.bg3
    barStack.cornerRadius = 2

    var filledCount = Math.round(pct * 40)
    var emptyCount = 40 - filledCount

    var fillText = barStack.addText(Array(filledCount + 1).join("|"))
    fillText.textColor = dc
    fillText.font = Font.systemFont(4)
    fillText.lineLimit = 1

    var emptyText = barStack.addText(Array(emptyCount + 1).join(" "))
    emptyText.textColor = C.bg3
    emptyText.font = Font.systemFont(4)

    widget.addSpacer(4)
  })

  widget.addSpacer()
}

// ── LARGE WIDGET ──
function buildLarge(widget) {
  widget.setPadding(16, 16, 16, 16)

  var header = widget.addStack()
  header.layoutHorizontally()
  header.centerAlignContent()

  var dot = header.addText("*")
  dot.textColor = C.accent
  dot.font = Font.boldSystemFont(9)
  header.addSpacer(5)

  var titleStack = header.addStack()
  titleStack.layoutVertically()
  var title = titleStack.addText("CASH FLOW")
  title.textColor = C.text
  title.font = Font.boldSystemFont(14)
  var sub = titleStack.addText("May - Aug 2026")
  sub.textColor = C.text3
  sub.font = Font.systemFont(10)

  header.addSpacer()

  var netBig = header.addStack()
  netBig.layoutVertically()
  var nbv = netBig.addText(fmtFull(totalNet))
  nbv.textColor = C.green
  nbv.font = Font.boldSystemFont(18)
  nbv.rightAlignText()
  var nbl = netBig.addText("4-month net")
  nbl.textColor = C.text3
  nbl.font = Font.systemFont(9)
  nbl.rightAlignText()

  widget.addSpacer(12)

  var mlabel = widget.addText("MONTHLY BREAKDOWN")
  mlabel.textColor = C.text3
  mlabel.font = Font.semiboldSystemFont(9)

  widget.addSpacer(6)

  var monthsRow = widget.addStack()
  monthsRow.layoutHorizontally()
  monthsRow.spacing = 6

  data.months.forEach(function(month, i) {
    var net = nets[i]
    var bal = balances[i]
    var card = monthsRow.addStack()
    card.layoutVertically()
    card.backgroundColor = C.bg2
    card.cornerRadius = 10
    card.setPadding(8, 8, 8, 8)

    var mn = card.addText(month)
    mn.textColor = C.text2
    mn.font = Font.semiboldSystemFont(10)

    card.addSpacer(3)

    var mv = card.addText(fmt(net))
    mv.textColor = net >= 0 ? C.green : C.red
    mv.font = Font.boldSystemFont(12)

    card.addSpacer(2)

    var mb = card.addText("bal " + fmt(bal))
    mb.textColor = C.text3
    mb.font = Font.systemFont(8)
  })

  widget.addSpacer(12)

  var dlabel = widget.addText("DEBT PAYOFF TRACKER")
  dlabel.textColor = C.text3
  dlabel.font = Font.semiboldSystemFont(9)

  widget.addSpacer(6)

  data.debts.forEach(function(debt) {
    addDebtRow(widget, debt)
  })

  widget.addSpacer()

  var footer = widget.addStack()
  footer.layoutHorizontally()
  var ft = footer.addText("Tap to open full dashboard")
  ft.textColor = C.text3
  ft.font = Font.systemFont(8)
}

// ── BUILD WIDGET ──
const widget = new ListWidget()
widget.backgroundColor = C.bg
widget.url = "https://seanjevangelista-pixel.github.io/cashflow"

var family = config.widgetFamily

if (family === "small") {
  buildSmall(widget)
} else if (family === "medium") {
  buildMedium(widget)
} else if (family === "accessoryRectangular" || family === "accessoryCircular" || family === "accessoryInline") {
  // Lock screen
  widget.setPadding(4, 4, 4, 4)
  var ls = widget.addStack()
  ls.layoutHorizontally()
  ls.centerAlignContent()
  var lsNet = ls.addText("Net " + fmt(totalNet))
  lsNet.textColor = C.green
  lsNet.font = Font.boldSystemFont(11)
  ls.addSpacer(8)
  var lsBal = ls.addText("Bal " + fmt(balances[balances.length - 1]))
  lsBal.textColor = C.blue
  lsBal.font = Font.systemFont(11)
  ls.addSpacer(8)
  var lsJason = ls.addText("J " + fmt(73050 - 21550))
  lsJason.textColor = C.red
  lsJason.font = Font.systemFont(11)
} else {
  // Default to large
  buildLarge(widget)
}

if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  // Preview all sizes when run manually
  widget.presentSmall()
}

Script.complete()
