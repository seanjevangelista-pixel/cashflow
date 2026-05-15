// CASH FLOW WIDGET — Paste into Scriptable

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

const nets = data.months.map(function(_, i) { return data.income[i] - data.obligations[i] })
const totalIn = data.income.reduce(function(a, b) { return a + b }, 0)
const totalOut = data.obligations.reduce(function(a, b) { return a + b }, 0)
const totalNet = totalIn - totalOut

var running = 0
const balances = nets.map(function(n) { running += n; return running })

const C = {
  bg:     new Color("#080a09"),
  bg2:    new Color("#0f110f"),
  bg3:    new Color("#1c1f1c"),
  text:   new Color("#eceeed"),
  text2:  new Color("#7a8079"),
  text3:  new Color("#404540"),
  green:  new Color("#5dfc8d"),
  red:    new Color("#ff6b6b"),
  accent: new Color("#c4f135"),
}

function fmt(n) {
  var abs = Math.abs(Math.round(n))
  var str = abs.toLocaleString()
  return (n < 0 ? "-$" : "$") + str
}

const widget = new ListWidget()
widget.backgroundColor = C.bg
widget.setPadding(14, 14, 14, 14)
widget.url = "https://seanjevangelista-pixel.github.io/cashflow"

// HEADER
const header = widget.addStack()
header.layoutHorizontally()
header.centerAlignContent()

const titleStack = header.addStack()
titleStack.layoutVertically()
const title = titleStack.addText("CASH FLOW")
title.textColor = C.text
title.font = Font.boldSystemFont(13)

const subtitle = titleStack.addText("May - Aug 2026")
subtitle.textColor = C.text3
subtitle.font = Font.systemFont(9)

header.addSpacer()

const jasonStack = header.addStack()
jasonStack.layoutVertically()
const jasonLabel = jasonStack.addText("JASON")
jasonLabel.textColor = C.text3
jasonLabel.font = Font.systemFont(8)
jasonLabel.rightAlignText()
const jasonVal = jasonStack.addText("$51,550")
jasonVal.textColor = C.red
jasonVal.font = Font.boldSystemFont(12)
jasonVal.rightAlignText()

widget.addSpacer(10)

// SUMMARY
const summaryStack = widget.addStack()
summaryStack.layoutHorizontally()
summaryStack.spacing = 6

function addCard(parent, label, value, color) {
  const card = parent.addStack()
  card.layoutVertically()
  card.backgroundColor = C.bg2
  card.cornerRadius = 8
  card.setPadding(8, 10, 8, 10)
  const l = card.addText(label)
  l.textColor = C.text3
  l.font = Font.systemFont(9)
  const v = card.addText(value)
  v.textColor = color
  v.font = Font.boldSystemFont(14)
}

addCard(summaryStack, "TOTAL IN", fmt(totalIn), C.green)
summaryStack.addSpacer(6)
addCard(summaryStack, "TOTAL OUT", fmt(totalOut), C.red)
summaryStack.addSpacer(6)
addCard(summaryStack, "NET", fmt(totalNet), totalNet >= 0 ? C.green : C.red)

widget.addSpacer(10)

// MONTHS
const mlabel = widget.addText("MONTHLY BREAKDOWN")
mlabel.textColor = C.text3
mlabel.font = Font.semiboldSystemFont(9)

widget.addSpacer(6)

const monthsStack = widget.addStack()
monthsStack.layoutHorizontally()
monthsStack.spacing = 5

data.months.forEach(function(month, i) {
  var net = nets[i]
  var bal = balances[i]
  var isPos = net >= 0
  const card = monthsStack.addStack()
  card.layoutVertically()
  card.backgroundColor = C.bg2
  card.cornerRadius = 8
  card.setPadding(8, 8, 8, 8)
  const m = card.addText(month)
  m.textColor = C.text2
  m.font = Font.semiboldSystemFont(10)
  card.addSpacer(3)
  const netText = card.addText(fmt(net))
  netText.textColor = isPos ? C.green : C.red
  netText.font = Font.boldSystemFont(11)
  card.addSpacer(2)
  const balText = card.addText("bal " + fmt(bal))
  balText.textColor = C.text3
  balText.font = Font.systemFont(8)
})

widget.addSpacer(10)

// DEBT TRACKER
const dlabel = widget.addText("DEBT PAYOFF TRACKER")
dlabel.textColor = C.text3
dlabel.font = Font.semiboldSystemFont(9)

widget.addSpacer(6)

data.debts.forEach(function(debt) {
  var pct = Math.min(debt.paid / debt.total, 1)
  var remaining = Math.max(debt.total - debt.paid, 0)
  var cleared = remaining === 0

  const row = widget.addStack()
  row.layoutHorizontally()
  row.centerAlignContent()

  const nameText = row.addText(cleared ? debt.name + " CLEARED" : debt.name)
  nameText.textColor = new Color(debt.color)
  nameText.font = Font.semiboldSystemFont(10)
  nameText.minimumScaleFactor = 0.8

  row.addSpacer()

  const pctText = row.addText(Math.round(pct * 100) + "%")
  pctText.textColor = new Color(debt.color)
  pctText.font = Font.boldSystemFont(10)

  row.addSpacer(6)

  const remText = row.addText(cleared ? "done" : fmt(remaining) + " left")
  remText.textColor = C.text3
  remText.font = Font.systemFont(9)
  remText.minimumScaleFactor = 0.7

  widget.addSpacer(6)
})

// FOOTER
widget.addSpacer()
const footer = widget.addStack()
footer.layoutHorizontally()
const updated = footer.addText("Tap to open full dashboard")
updated.textColor = C.text3
updated.font = Font.systemFont(8)

if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentLarge()
}
Script.complete()
