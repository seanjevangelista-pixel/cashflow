// CASH FLOW WIDGET — Soft Modern (Purple + Teal)
// Small = 4 stat cards
// Medium = strips + debt bars
// Large = full dashboard
// Lock screen = inline stats

const data = {
  months: ["May", "Jun", "Jul", "Aug"],
  income: [8800, 7500, 6670, 7000],
  obligations: [6200, 6600, 5580, 3500],
  debts: [
    { name: "Beto",      total: 3380,  paid: 3380,  color: "#fbbf24" },
    { name: "Kris",      total: 3000,  paid: 3000,  color: "#a78bfa" },
    { name: "Anthony V", total: 4250,  paid: 2000,  color: "#60a5fa" },
    { name: "Jason",     total: 73050, paid: 21550, color: "#f87171" },
  ]
}

const nets = data.months.map(function(m, i) { return data.income[i] - data.obligations[i] })
const totalIn = data.income.reduce(function(a, b) { return a + b }, 0)
const totalOut = data.obligations.reduce(function(a, b) { return a + b }, 0)
const totalNet = totalIn - totalOut
var running = 0
const balances = nets.map(function(n) { running += n; return running })

const C = {
  bg:      new Color("#171629"),
  bg2:     new Color("#1e1b35"),
  bg3:     new Color("#252240"),
  teal:    new Color("#34d399"),
  teal2:   new Color("#0d9e6a"),
  purple:  new Color("#8b5cf6"),
  purple2: new Color("#6d28d9"),
  red:     new Color("#ef4444"),
  amber:   new Color("#fbbf24"),
  blue:    new Color("#60a5fa"),
  violet:  new Color("#a78bfa"),
  text:    new Color("#f0eeff"),
  text2:   new Color("#8b88b0"),
  text3:   new Color("#4a4870"),
  dot:     new Color("#34d399"),
}

function fmt(n) {
  var abs = Math.abs(Math.round(n))
  if (abs >= 1000) return (n < 0 ? "-$" : "$") + (abs / 1000).toFixed(1) + "k"
  return (n < 0 ? "-$" : "$") + abs.toString()
}

function fmtFull(n) {
  var abs = Math.abs(Math.round(n))
  return (n < 0 ? "-$" : "$") + abs.toLocaleString()
}

function pct(debt) {
  return Math.min(debt.paid / debt.total, 1)
}

function addDebtRow(w, debt) {
  var p = pct(debt)
  var cleared = debt.paid >= debt.total
  var dc = new Color(debt.color)

  var row = w.addStack()
  row.layoutHorizontally()
  row.centerAlignContent()

  var n = row.addText(debt.name)
  n.textColor = dc
  n.font = Font.semiboldSystemFont(11)
  n.minimumScaleFactor = 0.7

  row.addSpacer()

  var pctText = row.addText(cleared ? "CLEARED" : Math.round(p * 100) + "%")
  pctText.textColor = cleared ? C.teal : dc
  pctText.font = Font.boldSystemFont(11)

  w.addSpacer(3)

  var barStack = w.addStack()
  barStack.backgroundColor = C.bg3
  barStack.cornerRadius = 3

  var filledCount = Math.round(p * 38)
  var emptyCount = 38 - filledCount

  var fillT = barStack.addText(Array(filledCount + 1).join("|"))
  fillT.textColor = dc
  fillT.font = Font.systemFont(4)
  fillT.lineLimit = 1

  var emptyT = barStack.addText(Array(emptyCount + 1).join(" "))
  emptyT.textColor = C.bg3
  emptyT.font = Font.systemFont(4)

  w.addSpacer(6)
}

// ── SMALL ──
function buildSmall(w) {
  w.setPadding(14, 14, 14, 14)

  var header = w.addStack()
  header.layoutHorizontally()
  header.centerAlignContent()

  var dotStack = header.addStack()
  dotStack.layoutHorizontally()
  dotStack.centerAlignContent()
  var dot = dotStack.addText("o")
  dot.textColor = C.dot
  dot.font = Font.boldSystemFont(7)

  header.addSpacer(5)

  var titleStack = header.addStack()
  titleStack.layoutVertically()
  var t = titleStack.addText("Cash Flow")
  t.textColor = C.text
  t.font = Font.boldSystemFont(12)
  var s = titleStack.addText("May - Aug 2026")
  s.textColor = C.text3
  s.font = Font.systemFont(9)

  w.addSpacer(10)

  var row1 = w.addStack()
  row1.layoutHorizontally()
  row1.spacing = 6

  function sCard(parent, label, val, color) {
    var c = parent.addStack()
    c.layoutVertically()
    c.backgroundColor = C.bg2
    c.cornerRadius = 10
    c.setPadding(8, 10, 8, 10)
    var l = c.addText(label)
    l.textColor = C.text3
    l.font = Font.systemFont(8)
    l.minimumScaleFactor = 0.7
    var v = c.addText(val)
    v.textColor = color
    v.font = Font.boldSystemFont(14)
    v.minimumScaleFactor = 0.7
  }

  sCard(row1, "NET", fmt(totalNet), C.teal)
  row1.addSpacer(6)
  sCard(row1, "BAL", fmt(balances[balances.length - 1]), C.purple)

  w.addSpacer(6)

  var row2 = w.addStack()
  row2.layoutHorizontally()
  row2.spacing = 6

  sCard(row2, "JASON", fmt(73050 - 21550), C.red)
  row2.addSpacer(6)
  sCard(row2, "AUG", fmt(nets[3]), C.teal)

  w.addSpacer()
}

// ── MEDIUM ──
function buildMedium(w) {
  w.setPadding(14, 14, 14, 14)

  var header = w.addStack()
  header.layoutHorizontally()
  header.centerAlignContent()

  var dot = header.addText("o")
  dot.textColor = C.dot
  dot.font = Font.boldSystemFont(8)
  header.addSpacer(5)

  var titleStack = header.addStack()
  titleStack.layoutVertically()
  var t = titleStack.addText("Cash Flow")
  t.textColor = C.text
  t.font = Font.boldSystemFont(13)
  var s = titleStack.addText("May - Aug 2026")
  s.textColor = C.text3
  s.font = Font.systemFont(10)

  header.addSpacer()

  var pillStack = header.addStack()
  pillStack.layoutVertically()
  pillStack.backgroundColor = new Color("#0d9e6a", 0.15)
  pillStack.cornerRadius = 12
  pillStack.setPadding(5, 10, 5, 10)
  var pl = pillStack.addText("4-mo net")
  pl.textColor = new Color("#34d399", 0.6)
  pl.font = Font.systemFont(9)
  pl.rightAlignText()
  var pv = pillStack.addText(fmtFull(totalNet))
  pv.textColor = C.teal
  pv.font = Font.boldSystemFont(14)
  pv.rightAlignText()

  w.addSpacer(12)

  var strips = w.addStack()
  strips.layoutHorizontally()
  strips.spacing = 6

  function strip(parent, label, val, sub2, color) {
    var s = parent.addStack()
    s.layoutVertically()
    s.backgroundColor = C.bg2
    s.cornerRadius = 12
    s.setPadding(10, 10, 10, 10)
    var l = s.addText(label)
    l.textColor = C.text3
    l.font = Font.systemFont(8)
    var v = s.addText(val)
    v.textColor = color
    v.font = Font.boldSystemFont(15)
    var s2 = s.addText(sub2)
    s2.textColor = C.text3
    s2.font = Font.systemFont(8)
  }

  strip(strips, "May net", fmt(nets[0]), "balance " + fmt(balances[0]), C.teal)
  strip(strips, "Balance", fmt(balances[balances.length - 1]), "running total", C.purple)
  strip(strips, "Jason", fmt(73050 - 21550), "still owed", C.red)

  w.addSpacer(12)

  data.debts.forEach(function(debt) { addDebtRow(w, debt) })

  w.addSpacer()
}

// ── LARGE ──
function buildLarge(w) {
  w.setPadding(16, 16, 16, 16)

  var header = w.addStack()
  header.layoutHorizontally()
  header.centerAlignContent()

  var dot = header.addText("o")
  dot.textColor = C.dot
  dot.font = Font.boldSystemFont(9)
  header.addSpacer(6)

  var titleStack = header.addStack()
  titleStack.layoutVertically()
  var t = titleStack.addText("Cash Flow")
  t.textColor = C.text
  t.font = Font.boldSystemFont(15)
  var s = titleStack.addText("May - Aug 2026")
  s.textColor = C.text3
  s.font = Font.systemFont(10)

  header.addSpacer()

  var netStack = header.addStack()
  netStack.layoutVertically()
  var nv = netStack.addText(fmtFull(totalNet))
  nv.textColor = C.teal
  nv.font = Font.boldSystemFont(20)
  nv.rightAlignText()
  var nl = netStack.addText("4-month net")
  nl.textColor = C.text3
  nl.font = Font.systemFont(9)
  nl.rightAlignText()

  w.addSpacer(14)

  var mlabel = w.addText("Monthly breakdown")
  mlabel.textColor = C.text3
  mlabel.font = Font.semiboldSystemFont(10)

  w.addSpacer(7)

  var monthsRow = w.addStack()
  monthsRow.layoutHorizontally()
  monthsRow.spacing = 6

  data.months.forEach(function(month, i) {
    var net = nets[i]
    var bal = balances[i]
    var isPos = net >= 0
    var card = monthsRow.addStack()
    card.layoutVertically()
    card.backgroundColor = C.bg2
    card.cornerRadius = 12
    card.setPadding(10, 8, 10, 8)

    var mn = card.addText(month)
    mn.textColor = C.text2
    mn.font = Font.semiboldSystemFont(10)

    card.addSpacer(4)

    var mv = card.addText(fmt(net))
    mv.textColor = isPos ? C.teal : C.red
    mv.font = Font.boldSystemFont(13)

    card.addSpacer(2)

    var mb = card.addText("bal " + fmt(bal))
    mb.textColor = C.text3
    mb.font = Font.systemFont(8)
  })

  w.addSpacer(14)

  var dlabel = w.addText("Debt payoff tracker")
  dlabel.textColor = C.text3
  dlabel.font = Font.semiboldSystemFont(10)

  w.addSpacer(8)

  data.debts.forEach(function(debt) { addDebtRow(w, debt) })

  w.addSpacer()

  var footer = w.addStack()
  footer.layoutHorizontally()
  var ft = footer.addText("Tap to open full dashboard")
  ft.textColor = C.text3
  ft.font = Font.systemFont(9)
}

// ── BUILD ──
const widget = new ListWidget()
widget.backgroundColor = C.bg
widget.url = "https://seanjevangelista-pixel.github.io/cashflow"

var family = config.widgetFamily

if (family === "small") {
  buildSmall(widget)
} else if (family === "medium") {
  buildMedium(widget)
} else if (family === "accessoryRectangular" || family === "accessoryCircular" || family === "accessoryInline") {
  widget.setPadding(4, 4, 4, 4)
  var ls = widget.addStack()
  ls.layoutHorizontally()
  ls.centerAlignContent()
  var lsNet = ls.addText("Net " + fmt(totalNet))
  lsNet.textColor = C.teal
  lsNet.font = Font.boldSystemFont(11)
  ls.addSpacer(8)
  var lsBal = ls.addText("Bal " + fmt(balances[balances.length - 1]))
  lsBal.textColor = C.purple
  lsBal.font = Font.systemFont(11)
  ls.addSpacer(8)
  var lsJ = ls.addText("J " + fmt(73050 - 21550))
  lsJ.textColor = C.red
  lsJ.font = Font.systemFont(11)
} else {
  buildLarge(widget)
}

if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentLarge()
}

Script.complete()
