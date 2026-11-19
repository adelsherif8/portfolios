---
title: Can an AI receptionist work with my existing business number?
seo_title: AI receptionist on your existing business number?
description: Yes. Forward calls from your current number, or move the number itself. How each route works, what can break, and which one to pick.
date: 2026-11-19
slug: ai-receptionist-existing-business-number
service: /voice-agent-engineer/
service_label: AI voice agent build
tags: ai receptionist, business phone number, call forwarding
---
Yes. Your customers keep dialing the number they already know. You either forward calls from that number to the agent, or move the number to the agent's phone provider. Forwarding is the quicker route. It adds a hop between the caller and the agent, and that hop needs its own test.

## What are the two ways to connect an existing number?

**Forwarding.** Your carrier keeps the number and passes calls on to a second number that the AI agent answers. Nothing moves. You can turn it off in seconds.

**Moving the number.** The number leaves your carrier and goes to the provider the agent runs on. This is called porting. Calls then reach the agent directly, with no forwarding hop.

Retell, a voice agent platform, [describes forwarding](https://www.retellai.com/ai-answering-service/call-forwarding-answering-service) as keeping "the number your customers already call," with no porting needed. That is the vendor's own marketing page, so treat it as a description of the idea, not a promise about your carrier.

## Which forwarding type should you ask your carrier for?

Three types matter, and they give very different results.

- **Always forward:** every call goes to the agent. Your own phone never rings.
- **Forward when busy:** the agent catches calls only while you are on another line.
- **Forward when unanswered:** your phone rings first, and the agent picks up if you do not.

Take a plumber on a job site. With "unanswered" forwarding, the phone rings in the pocket for a set number of rings, then the call goes to the agent. Verizon's [forwarding page](https://www.verizon.com/support/call-forwarding-faqs/) lists the codes: `*72` plus the number forwards everything, `*71` plus the number forwards unanswered calls, and `*73` turns it off. That page describes no separate busy option, so check what your own carrier offers.

The same page says forwarded calls are billed as if you answered them, unless your plan has unlimited minutes. It also says the destination must be a 10-digit US number, which matters if your agent's number is not a normal US line.

## What can go wrong with forwarding?

Failures here are quiet, because the agent never hears a call that does not reach it.

A public [Retell community thread](https://community.retellai.com/t/inbound-calls-via-carrier-call-forwarding-not-connecting-not-connected-user-hangup-0s-direct-dial-works-fine/3542) shows the pattern. A customer forwarded an existing mobile line to a Retell number through a Twilio trunk. Two forwarded calls showed as not connected with 0 seconds, while a direct dial to the same number and agent connected and lasted 6 seconds. At the time of that thread, no root cause had been posted.

That is one report, not proof it happens often. But it shows the direct number can work while the forwarded path fails. So never judge a setup by calling the agent's own number.

Three more things to check:

- **Caller ID.** Ask your builder whether the agent sees the customer's number or only your forwarding line. Text-back and callbacks need the customer's.
- **Ring count.** Unanswered forwarding waits before it hands off. Time it, because a caller who hears many rings may give up.
- **Carrier differences.** Check the codes for your own carrier. A business phone system may have its own forwarding settings instead.

## When is moving the number worth it?

When forwarding keeps misbehaving, when you want the agent to answer every call, or when you are replacing your old phone service anyway. Porting removes the hop.

It costs time. A 2009 FCC rule set [one business day](https://www.govinfo.gov/content/pkg/FR-2009-07-02/pdf/E9-15132.pdf) for simple ports, and I found no published time for other kinds. Ask your carrier whether yours is simple before you plan a date, and ask before cancelling the old service so you do not lose the number.

I cover the date question in [how long it takes to set up an AI phone agent](/blog/how-long-to-set-up-ai-phone-agent/).

## Which route would I start with, and how do I test it?

Unanswered forwarding on a quiet day. It leaves your phone in charge, you can undo it with one code, and the first week of call logs shows what the agent catches before you hand it more.

My own test suite runs 38 simulated callers and 114 calls per run. It checks what the agent says, not your carrier, so the phone path needs its own check on your real line:

1. Call from a mobile that is not your own, so the caller ID is a stranger's.
2. Let it ring out, and count how many seconds pass before the agent speaks.
3. Call while you are on another call, if you chose busy forwarding.
4. Check the call log: did the agent record the caller's actual number?
5. Repeat at night, in case your phone system has separate after-hours rules.

The agents on my [voice agent page](/voice-agent-engineer/) answer in about 1 second once a call reaches them. Time the gap before that on your own line.

## When should you not connect an AI agent to your main number?

- **You answer nearly every call yourself.** If few rings out, count last month's missed calls first. The [pricing page](/pricing/) shows a voice agent at $900 to build, then $450 a month with 500 minutes, so a few missed calls a month may not cover it.
- **Your number sits on a complex phone system.** A multi-line office, a group of phones that ring together or old landline hardware can make forwarding harder to predict. Try a spare line first.
- **You cannot test.** If nobody will place the five test calls above, wait.
- **Calls need a person within seconds.** If most calls are urgent, the agent should transfer them to a human. My post on [emergency calls](/blog/ai-phone-agent-emergency-calls/) covers that.

## Checklist before you connect

- Find out which carrier holds the number and whether it is a mobile, a landline or a business system.
- Ask which forwarding types it supports: always, busy, unanswered.
- Start with unanswered forwarding on a quiet day, not always-on.
- Place the five test calls above, from a phone the agent has never seen.
- Keep the carrier's turn-off code written next to your phone.
- Decide a review date, and read the first week of call logs.

To hear what a caller hears once the call arrives, try the [Blue Ridge recovery demo](https://voicedesk-h31g.onrender.com/agent/recovery).
