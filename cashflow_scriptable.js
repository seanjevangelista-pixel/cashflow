// CASH FLOW WIDGET — Soft Modern Purple Teal
// Small  = 4 glassy stat cards
// Medium = strips + debt tracker
// Large  = full dashboard / StandBy
// Lock   = net profit + arrow + month change

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
const jasonLeft = 73050 - 21550

// Month over month change — current month vs previous month
const now = new Date()
const currentMonthIdx = Math.min(now.getMonth() - 4, data.months.length - 1)
const safeIdx = Math.max(0, Math.min(currentMonthIdx, data.months.length - 1))
const currentNet = nets[safeIdx]
const prevNet = safeIdx > 0 ? nets[safeIdx - 1] : null
const monthChange = prevNet !== null ? currentNet - prevNet : null
const isUp = monthChange !== null ? monthChange >= 0 : true
const arrow = isUp ? "+" : "-"
const currentMonthName = data.months[safeIdx]

const C = {
  bg:     new Color("#12112a"),
  bg2:    new Color("#1a1833"),
  bg3:    new Color("#22204a"),
  teal:   new Color("#34d399"),
  purple: new Color("#8b5cf6"),
  red:    new Color("#f87171"),
  amber:  new Color("#fbbf24"),
  blue:   new Color("#60a5fa"),
  violet: new Color("#a78bfa"),
  text:   new Color("#eeeeff"),
  text2:  new Color("#8885b8"),
  text3:  new Color("#44426a"),
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

function debtBar(w, debt, barLen) {
  var p = Math.min(debt.paid / debt.total, 1)
  var cleared = debt.paid >= debt.total
  var dc = new Color(debt.color)
  var len = barLen || 36

  var row = w.addStack()
  row.layoutHorizontally()
  row.centerAlignContent()

  var n = row.addText(debt.name)
  n.textColor = dc
  n.font = Font.semiboldSystemFont(11)
  n.minimumScaleFactor = 0.7
  row.addSpacer()

  var pctLabel = row.addText(cleared ? "CLEARED" : Math.round(p * 100) + "%")
  pctLabel.textColor = cleared ? C.teal : dc
  pctLabel.font = Font.boldSystemFont(11)

  if (!cleared) {
    row.addSpacer(5)
    var rem = row.addText(fmtFull(debt.total - debt.paid) + " left")
    rem.textColor = C.text3
    rem.font = Font.systemFont(9)
    rem.minimumScaleFactor = 0.7
  }

  w.addSpacer(3)

  var bar = w.addStack()
  bar.backgroundColor = C.bg3
  bar.cornerRadius = 3

  var filled = Math.round(p * len)
  var empty = len - filled

  var ft = bar.addText(Array(filled + 1).join("|"))
  ft.textColor = dc
  ft.font = Font.systemFont(4)
  ft.lineLimit = 1

  var et = bar.addText(Array(empty + 1).join(" "))
  et.textColor = C.bg3
  et.font = Font.systemFont(4)

  w.addSpacer(6)
}

// ── SMALL ──
function buildSmall(w) {
  w.setPadding(12, 12, 12, 12)

  var hdr = w.addStack()
  hdr.layoutHorizontally()
  hdr.centerAlignContent()

  var dot = hdr.addText("o")
  dot.textColor = C.teal
  dot.font = Font.boldSystemFont(8)
  hdr.addSpacer(5)

  var ht = hdr.addStack()
  ht.layoutVertically()
  var t = ht.addText("Cash Flow")
  t.textColor = C.text
  t.font = Font.boldSystemFont(12)
  var s = ht.addText("May - Aug 2026")
  s.textColor = C.text3
  s.font = Font.systemFont(8)

  w.addSpacer(10)

  function glassCard(parent, label, val, color) {
    var c = parent.addStack()
    c.layoutVertically()
    c.backgroundColor = C.bg2
    c.cornerRadius = 12
    c.setPadding(9, 10, 9, 10)
    var l = c.addText(label)
    l.textColor = C.text3
    l.font = Font.systemFont(8)
    l.minimumScaleFactor = 0.7
    var v = c.addText(val)
    v.textColor = color
    v.font = Font.boldSystemFont(15)
    v.minimumScaleFactor = 0.6
  }

  var r1 = w.addStack()
  r1.layoutHorizontally()
  r1.spacing = 5
  glassCard(r1, "4-mo net", fmt(totalNet), C.teal)
  r1.addSpacer(5)
  glassCard(r1, "Balance", fmt(balances[3]), C.purple)

  w.addSpacer(5)

  var r2 = w.addStack()
  r2.layoutHorizontally()
  r2.spacing = 5
  glassCard(r2, "Jason", fmt(jasonLeft), C.red)
  r2.addSpacer(5)
  glassCard(r2, "Aug net", fmt(nets[3]), C.teal)

  w.addSpacer()
}

// ── MEDIUM ──
function buildMedium(w) {
  w.setPadding(14, 14, 14, 14)

  var hdr = w.addStack()
  hdr.layoutHorizontally()
  hdr.centerAlignContent()

  var dot = hdr.addText("o")
  dot.textColor = C.teal
  dot.font = Font.boldSystemFont(9)
  hdr.addSpacer(6)

  var ht = hdr.addStack()
  ht.layoutVertically()
  var t = ht.addText("Cash Flow")
  t.textColor = C.text
  t.font = Font.boldSystemFont(14)
  var s = ht.addText("May - Aug 2026")
  s.textColor = C.text3
  s.font = Font.systemFont(10)

  hdr.addSpacer()

  var pill = hdr.addStack()
  pill.layoutVertically()
  pill.backgroundColor = new Color("#0d9e6a", 0.15)
  pill.cornerRadius = 14
  pill.setPadding(6, 12, 6, 12)
  var pl = pill.addText("4-mo net")
  pl.textColor = new Color("#34d399", 0.5)
  pl.font = Font.systemFont(9)
  pl.rightAlignText()
  var pv = pill.addText(fmtFull(totalNet))
  pv.textColor = C.teal
  pv.font = Font.boldSystemFont(15)
  pv.rightAlignText()

  w.addSpacer(12)

  var cards = w.addStack()
  cards.layoutHorizontally()
  cards.spacing = 7

  function mCard(parent, label, val, sub2, color) {
    var c = parent.addStack()
    c.layoutVertically()
    c.backgroundColor = C.bg2
    c.cornerRadius = 14
    c.setPadding(10, 12, 10, 12)
    var l = c.addText(label)
    l.textColor = C.text3
    l.font = Font.systemFont(9)
    var v = c.addText(val)
    v.textColor = color
    v.font = Font.boldSystemFont(16)
    v.minimumScaleFactor = 0.7
    var s2 = c.addText(sub2)
    s2.textColor = C.text3
    s2.font = Font.systemFont(8)
  }

  mCard(cards, "May net", fmt(nets[0]), "bal " + fmt(balances[0]), C.teal)
  mCard(cards, "Aug net", fmt(nets[3]), "bal " + fmt(balances[3]), C.teal)
  mCard(cards, "Balance", fmt(balances[3]), "running", C.purple)
  mCard(cards, "Jason", fmt(jasonLeft), "owed", C.red)

  w.addSpacer(12)

  var dl = w.addText("Debt payoff")
  dl.textColor = C.text3
  dl.font = Font.semiboldSystemFont(10)
  w.addSpacer(6)

  data.debts.forEach(function(d) { debtBar(w, d, 42) })

  w.addSpacer()
}

// ── LARGE / STANDBY ──
function buildLarge(w) {
  w.setPadding(18, 18, 18, 18)

  var hdr = w.addStack()
  hdr.layoutHorizontally()
  hdr.centerAlignContent()

  var dot = hdr.addText("o")
  dot.textColor = C.teal
  dot.font = Font.boldSystemFont(10)
  hdr.addSpacer(7)

  var ht = hdr.addStack()
  ht.layoutVertically()
  var t = ht.addText("Cash Flow")
  t.textColor = C.text
  t.font = Font.boldSystemFont(17)
  var s = ht.addText("May - Aug 2026")
  s.textColor = C.text3
  s.font = Font.systemFont(11)

  hdr.addSpacer()

  var netStack = hdr.addStack()
  netStack.layoutVertically()
  var nv = netStack.addText(fmtFull(totalNet))
  nv.textColor = C.teal
  nv.font = Font.boldSystemFont(22)
  nv.rightAlignText()
  var nl = netStack.addText("4-month net")
  nl.textColor = C.text3
  nl.font = Font.systemFont(10)
  nl.rightAlignText()

  w.addSpacer(16)

  var topCards = w.addStack()
  topCards.layoutHorizontally()
  topCards.spacing = 7

  function bigCard(parent, label, val, sub2, color) {
    var c = parent.addStack()
    c.layoutVertically()
    c.backgroundColor = C.bg2
    c.cornerRadius = 14
    c.setPadding(12, 12, 12, 12)
    var l = c.addText(label)
    l.textColor = C.text3
    l.font = Font.systemFont(9)
    var v = c.addText(val)
    v.textColor = color
    v.font = Font.boldSystemFont(17)
    v.minimumScaleFactor = 0.7
    var s2 = c.addText(sub2)
    s2.textColor = C.text3
    s2.font = Font.systemFont(9)
  }

  bigCard(topCards, "Balance", fmt(balances[3]), "running total", C.purple)
  bigCard(topCards, "Jason owed", fmt(jasonLeft), "to pay back", C.red)

  w.addSpacer(12)

  var ml = w.addText("Monthly breakdown")
  ml.textColor = C.text3
  ml.font = Font.semiboldSystemFont(10)
  w.addSpacer(7)

  var monthsRow = w.addStack()
  monthsRow.layoutHorizontally()
  monthsRow.spacing = 7

  data.months.forEach(function(month, i) {
    var net = nets[i]
    var bal = balances[i]
    var card = monthsRow.addStack()
    card.layoutVertically()
    card.backgroundColor = C.bg2
    card.cornerRadius = 14
    card.setPadding(10, 10, 10, 10)

    var mn = card.addText(month)
    mn.textColor = C.text2
    mn.font = Font.semiboldSystemFont(10)
    card.addSpacer(4)

    var mv = card.addText(fmt(net))
    mv.textColor = net >= 0 ? C.teal : C.red
    mv.font = Font.boldSystemFont(14)
    card.addSpacer(2)

    var mb = card.addText("bal " + fmt(bal))
    mb.textColor = C.text3
    mb.font = Font.systemFont(8)
  })

  w.addSpacer(14)

  var dLabel = w.addText("Debt payoff tracker")
  dLabel.textColor = C.text3
  dLabel.font = Font.semiboldSystemFont(10)
  w.addSpacer(8)

  data.debts.forEach(function(d) { debtBar(w, d, 44) })

  w.addSpacer()

  var footer = w.addStack()
  footer.layoutHorizontally()
  var ft = footer.addText("Tap to open full dashboard")
  ft.textColor = C.text3
  ft.font = Font.systemFont(9)
}

// ── LOCK SCREEN ──
function buildLock(w) {
  w.setPadding(2, 2, 2, 2)

  var stack = w.addStack()
  stack.layoutHorizontally()
  stack.centerAlignContent()
  stack.spacing = 6

  // Arrow signal
  var arrowText = isUp ? "^" : "v"
  var arrowColor = isUp ? C.teal : C.red
  var arrow = stack.addText(arrowText)
  arrow.textColor = arrowColor
  arrow.font = Font.boldSystemFont(13)

  // Net profit
  var netText = stack.addText(fmtFull(currentNet))
  netText.textColor = isUp ? C.teal : C.red
  netText.font = Font.boldSystemFont(13)

  stack.addSpacer(4)

  // Month name
  var monthText = stack.addText(currentMonthName)
  monthText.textColor = C.text2
  monthText.font = Font.systemFont(11)

  // Month over month change
  if (monthChange !== null) {
    stack.addSpacer(4)
    var changeSign = monthChange >= 0 ? "+" : ""
    var changeText = stack.addText(changeSign + fmt(monthChange) + " vs last mo")
    changeText.textColor = monthChange >= 0 ? C.teal : C.red
    changeText.font = Font.systemFont(10)
    changeText.minimumScaleFactor = 0.7
  }
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
  buildLock(widget)
} else {
  buildLarge(widget)
}

if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentLarge()
}
Script.complete()
