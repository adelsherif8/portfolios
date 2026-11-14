<!--
Draft, not published. Best score 88 (automatic 50 + review 38), near-miss round 2 of 2 on 2026-11-14 (round 1: 87). Earlier: 85.
TOP 3 FIXES from last review:
1. Cut inferred process claims ("right away if your carrier forwards", "each script change waits for you", "Step 4 starts after you are happy"). Add a labelled worked-example list: forwarding, trunk, simple port, complex port, with/without text-back, using only the 48h demo and FCC one-business-day facts.
2. Remove duplication: the "Text registration" bullet vs its own section, the repeated "20 scripted calls" sentence, the filler "A bigger suite..." line, double blank line.
3. Move the price out of paragraph 2 (keep it by the pricing link in the "wrong goal" section), keep one CTA, swap the .md Retell link for the normal docs URL, add one more first-hand detail from the facts list.
Note: topic lacks first-hand go-live timeline data.
-->
---
title: How long does it take to set up an AI phone agent?
description: A demo number you can call takes about 48 hours. Going live on your real line takes longer, because your number and your approval set the pace.
date: 2026-11-14
slug: how-long-to-set-up-ai-phone-agent
service: /voice-agent-engineer/
service_label: AI voice agent build
tags: ai phone agent, setup, voice agents
---
A demo number you can call comes within about 48 hours. Going live is a separate date: once you approve the script, it can follow right away if your carrier forwards calls, takes one business day for a simple port under the FCC rule, and longer for a complicated one.

Treat "demo" and "live" as two separate milestones, and ask any builder for a date on each. My build is $900, then $450 a month (the first three clients pay $600 for the build).

## What happens in the first 48 hours?

On my [voice agent page](/voice-agent-engineer/) the process has four steps:

1. **You tell me the three calls you get most.**
2. **I build and test it.** The agent runs against 20 scripted calls before you hear it.
3. **You call it yourself.** You get a demo number before go-live.
4. **Go live and hand over.**

The 48 hours is the wait for the first demo number from step 3. Step 4 starts after you are happy with the script.

## What decides how long going live takes?

Three things set the date.

**Your approval.** Each script change after you call the demo waits for you to listen and reply. A day of silence is a day added.

**Your phone number.** The agent must receive calls on the number your customers already dial. How that connects depends on your carrier.

**Text registration.** If the agent also texts callers, the texts need registration.


## How do you connect your existing business number?

The simplest idea is call forwarding: your carrier sends calls to the agent's number. Ask your carrier whether your plan supports it.

The other route keeps your number where it is and connects it to the agent platform. On Retell this is called SIP trunking, which is a way for a phone provider to pass calls over the internet to another system. The steps below come from Retell's [custom telephony guide](https://docs.retellai.com/deploy/custom-telephony.md), not from my own setup, so check your platform's docs if you use another one:

- Point your provider's trunk at Retell's SIP address.
- Enter your provider's termination address in Retell, plus a username and password if your provider uses them.
- Allow Retell's IP ranges through your provider's firewall. The page notes that many providers require this.
- Use **Test SIP Connection**, then save the number.

Then comes the step that is easy to skip. The same page says a passing connection test does not verify call behavior. It tells you to place an outbound call and receive an inbound call to confirm routing and audio. Do both before you call it done.

## What if the number has to move to a new carrier?

Moving a number is called porting, and I cannot speed it up. The FCC reduced the interval for simple wireline-to-wireline and simple intermodal ports to [one business day](https://www.govinfo.gov/content/pkg/FR-2009-07-02/pdf/E9-15132.pdf), effective August 3, 2009. It is a 2009 rule and covers simple ports only.

Ask your carrier whether yours counts as simple before anyone promises you a launch date.

## Does the text-back add time?

If the agent also texts callers, the texts need registration. Twilio says anyone sending texts over a normal 10-digit US number [must register for A2P 10DLC](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc), by creating a brand (who is sending) and a campaign (what the messages are for).

Twilio's page gives no approval time, so I will not invent one. Ask your builder about registration at the start, so it does not surprise you at go-live.

## Why not skip testing to go live faster?

Because testing is where the real problems show up, and the demo call is where you hear them. Before you hear an agent, it runs against 20 scripted calls.

A bigger suite shows why that step matters.

Mine runs 38 simulated callers and 114 calls per run, for about $0.25 a run. Its first run caught 5 missed emergency handoffs in 41 plumbing calls on a cheaper model. In plain terms, an emergency caller was not passed to a person five times out of 41.

A launch that skips testing ships that gap to your real customers. I describe the method in [how I test AI phone agents](/blog/how-we-test-ai-phone-agents/).

Retell has a built-in version. Its [simulation testing](https://docs.retellai.com/test/llm-simulation-testing) runs an AI caller against your agent and grades each run pass or fail. The page advises judging a scenario by its pass rate over several reruns, because the caller and the grader are both AI models.

Before launch, run your own check. Call the agent ten times, ask for something it does not know, interrupt it, and try an emergency.

## When is fast setup the wrong goal?

- **You have not decided what the agent may do.** If you cannot say which calls it books and which go to a person, a fast build only makes the gaps arrive sooner.
- **Your prices or menu change often and nobody will update them.** The agent only knows what it was given.
- **You miss very few calls.** Count the calls that rang out last month first. If the number is tiny, a build may not pay for itself. My [pricing page](/pricing/) shows what a build costs, so you can compare.
- **Nobody will read the first live calls.** Someone has to check them in week one.

## Checklist before you start the clock

- Find out who your phone carrier is, and ask whether your number is a simple port.
- Decide between forwarding and keeping the number on a trunk.
- Write down the three calls you get most.
- Decide which calls always go to a person.
- Ask your builder to start text registration early if you want text-back.
- Block an hour to call the demo and write down every change you want.

When you are ready, [call the Blue Ridge recovery demo](https://voicedesk-h31g.onrender.com/agent/recovery). It answers in about 1 second.
