---
title: After-hours calls: what home-service businesses lose overnight
seo_title: After-hours calls: what home services lose overnight
description: About 10% to 14% of HVAC calls arrive off-hours. How to price what you lose overnight from your own call log, and when an AI agent is not worth it.
date: 2026-11-16
slug: after-hours-calls-home-service
service: /plumbing/
service_label: AI phone agents for plumbing and HVAC
tags: after-hours calls, home services, missed calls
---
About one HVAC call in ten to one in seven arrives off-hours: 9.8% to 14.1% of inbound calls, depending on the month, in ServiceTitan's 2025 data. No plumbing figure exists that I could verify.

Below: what that dataset shows, how to price your own overnight loss in one evening, and when an AI agent is not worth it.

## How many home-service calls arrive after hours?

Roughly one in ten to one in seven, for residential HVAC. [ServiceTitan](https://www.servicetitan.com/toolbox/state-of-the-trades/trends/hvac-summer-after-hours-call-spike) counted every call outside Monday to Friday, 8am to 5pm in each shop's local time. Its 2025 numbers:

- **June peak:** 14.1% of inbound calls came off-hours.
- **October low:** 9.8%.
- **Weekday evenings and early mornings:** 9.3% in June, 6.8% in October.
- **Weekends:** 4.9% at the August peak, 2.95% in October.

Demand bunches up between 5pm and 9pm. A call at 3am is rare. A call at 7pm, while the owner eats dinner, is the usual one.

Two cautions. The data covers HVAC only, and ServiceTitan says it is not nationally representative. I found no published plumbing figure. Higher figures for "home services" circulate in vendor blogs, but I could not trace them to a primary study, so I leave them out.

## Is the loss really overnight, or is it during the day?

Possibly during the day. [Invoca's 2026 home services report](https://invoca.com/reports/the-invoca-home-services-lead-conversion-benchmarks-report-2026) found a person answered 52% of inbound calls to home service businesses. Leave out calls under 15 seconds and that rises to 65%.

If your shop answers only half its calls, the gap may be bigger at noon than at midnight. Count both before you spend anything, using the method in [how many calls a plumber misses](/blog/plumbing-missed-calls-cost/).

## Why can an overnight call be worth more than a daytime one?

Night and weekend jobs often bill higher.

[Housecall Pro](https://www.housecallpro.com/resources/how-to-price-plumbing-jobs/) lists emergency diagnostic fees of $149 to $259, usually separate from the repair, and says nights, weekends and holidays often run 1.5 to 3 times the standard hourly rate.

Voicemail loses callers. Moneypenny's [2016 call report](https://moneypenny.com/us/resources/news/small-business-call-report/) found 69% of callers who reached voicemail hung up without leaving a message. The figure is old, so treat it as a direction, not a measurement. A homeowner with water on the floor will likely dial the next company on the list.

## What does it look like when you price your own number?

Use your phone log, not an industry average. Here is an illustration with made-up figures, not a client result.

- You log 12 real customer calls off-hours in a month.
- You answered 3 yourself. That leaves 9 missed.
- Of those, 3 were emergencies and 6 could wait until morning.
- Emergencies close at 80% on a $400 ticket. Routine calls close at 25% on a $250 ticket.

That is 3 × 0.8 × $400 = $960, plus 6 × 0.25 × $250 = $375. Call it $1,335 a month, or about $16,000 a year, before you subtract the cost of covering those calls.

Now change the inputs. At 4 real missed calls a month, all routine, the loss is about $250. No software pays for itself there.

## What should happen to each overnight call?

Not every call deserves the same response. Sort them before you pick a tool.

1. **Emergency (burst pipe, no heat in a freeze, gas smell).** Needs a human or a dispatch slot within minutes. A gas smell should get a safety instruction first, not a booking.
2. **Urgent but not dangerous (water heater out, AC down in a heat wave).** Can book the first morning slot, if the caller hears that promise tonight.
3. **Routine (quote request, maintenance, "do you service my area?").** A text and a morning callback is enough.
4. **Noise (spam, vendors, wrong numbers).** Log it. Never wake anyone.

Check how your shop handles each tier today. In my view tiers 2 and 3 are the ones most likely to slip, because a callback at 8am can reach someone who already hired another company.

## What can an AI phone agent do with those calls?

It answers in about a second. The [plumbing and HVAC page](/plumbing/) describes what mine does on an emergency: it asks the safety questions first (is the water off, is there standing water, is anyone at risk), then books the emergency slot or transfers straight to your on-call number, depending on the rules you set. It quotes the dispatch fee and any flat-rate items you give it, and nothing else. Urgent, angry or out-of-rules calls go to a human, and it says so out loud.

On my Blue Ridge Plumbing demo, a missed call gets a text in 8 seconds and an AI callback in 52.

Emergency handling is the path I test hardest. My suite runs 38 simulated callers, 114 calls per run, for about $0.25 a run. Its first run caught 5 missed emergency handoffs in 41 plumbing calls on a cheaper model. See [how I test phone agents](/blog/how-we-test-ai-phone-agents/).

## When is an AI agent not the right choice?

- **Your log shows only a few real off-hours calls a month.** The worked example above shows when that stops paying. A text-back or a better voicemail greeting is enough.
- **Your daytime answer rate is the real problem.** Fix the noon calls first. A voice agent costs $900 to build and $450 a month with 500 minutes ([pricing](/pricing/)), so $6,300 in year one.
- **You already run a live on-call line that people answer.** Your emergency tier is covered.
- **Your jobs need a person to price them on the phone.** The agent quotes only the fees you give it.
- **You want a machine to handle a true emergency alone.** Transfer those to a person.

Run the arithmetic honestly. In the example above, $6,300 against a $16,000 yearly loss looks good, but halve the recovery rate, because an agent will not rescue every caller, and it is still ahead. At 4 missed routine calls a month, it is not.

## Checklist for this week

- Export 30 days of call logs and mark calls outside your hours.
- Sort the real customer calls into the four tiers above.
- Count how many you answered, and how many got a callback within an hour.
- Price tiers 1 and 2 with your own close rate and ticket, then halve the result.
- If the figure beats the [cost of an AI receptionist](/blog/ai-receptionist-cost-2026/), [call the demo agent](https://voicedesk-h31g.onrender.com/agent/recovery) and say your sink is backed up.
