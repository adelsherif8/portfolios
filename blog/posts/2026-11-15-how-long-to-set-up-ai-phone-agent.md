---
title: How long does it take to set up an AI phone agent?
description: A demo number you can call takes about 48 hours. Going live on your real line takes longer, because your number and your approval set the pace.
date: 2026-11-15
slug: how-long-to-set-up-ai-phone-agent
service: /voice-agent-engineer/
service_label: AI voice agent build
tags: ai phone agent, setup, voice agents
---
A demo number you can call comes within about 48 hours. Going live on your real line is a separate date, set mostly by your phone number. A simple port can take one business day under the FCC rule. A complicated one takes longer. You can skip the port entirely: keep your number and forward the calls nobody picks up to the agent. That is how our Missed-Call Recovery goes live in 48 hours.

Treat "demo" and "live" as two milestones, and ask any builder for a date on each.

## What happens in the first 48 hours?

On my [voice agent page](/voice-agent-engineer/) the process has four steps:

1. **You tell me the three calls you get most.**
2. **I build and test it.** The agent runs against 20 scripted calls first.
3. **You call it yourself.** You get a demo number before go-live.
4. **Go live and hand over.**

The 48 hours is the service page's promise of a demo number you can call, and the 20 scripted calls in step 2 happen inside it. Going live is step 4, and it has no fixed clock.

## What decides how long going live takes?

Three things set the date.

**Your approval.** After you call the demo, you decide when the script is right. The longer you take to reply, the later go-live is.

**Your phone number.** The agent must receive calls on the number your customers already dial. How that connects depends on your carrier.

**Text registration.** Only if you want text-back, covered below.

## How do you connect your existing business number?

The simplest idea is call forwarding: your carrier sends calls to the agent's number. Ask your carrier whether your plan supports it.

The other route keeps your number where it is and connects it to the agent platform. On Retell this is called SIP trunking, which is a way for a phone provider to pass calls over the internet to another system. The steps below come from Retell's [custom telephony guide](https://docs.retellai.com/deploy/custom-telephony), not from my own setup, so check your platform's docs if you use another one:

- Point your provider's trunk at Retell, and enter your provider's address in Retell.
- Allow Retell's IP ranges through your provider's firewall, if your provider requires it.
- Use **Test SIP Connection**, then save the number.

Then comes the step that is easy to skip. The same page says a passing connection test does not verify call behavior. It tells you to place an outbound call and receive an inbound call to confirm routing and audio. Do both before you call it done.

## What if the number has to move to a new carrier?

Moving a number is called porting, and I cannot speed it up. The FCC reduced the interval for simple wireline-to-wireline and simple intermodal ports to [one business day](https://www.govinfo.gov/content/pkg/FR-2009-07-02/pdf/E9-15132.pdf), effective August 3, 2009. It is a 2009 rule and covers simple ports only.

Ask your carrier whether yours counts as simple before anyone promises you a launch date.

## Does the text-back add time?

Twilio says anyone sending texts over a normal 10-digit US number [must register for A2P 10DLC](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc). That means creating a brand (who is sending) and a campaign (what the messages are for).

Twilio's page gives no approval time, so I will not invent one. Ask your builder about registration at the start, so it does not surprise you at go-live.

## Why not skip testing to go live faster?

Because testing is where the real problems show up, and the demo call is where you hear them. Before you hear an agent, it runs against 20 scripted calls. My own test suite is bigger.

It runs 38 simulated callers and 114 calls per run, for about $0.25 a run. Its first run caught 5 missed emergency handoffs in 41 plumbing calls on a cheaper model.

A launch that skips testing ships that gap to your real customers. I describe the method in [how I test AI phone agents](/blog/how-we-test-ai-phone-agents/).

Before launch, run your own check. Call the agent ten times, ask for something it does not know, interrupt it, and try an emergency.

## When is fast setup the wrong goal?

- **You have not decided what the agent may do.** If you cannot say which calls it books and which go to a person, a fast build only makes the gaps arrive sooner.
- **Your prices or menu change often and nobody will update them.** The agent only knows what it was given.
- **You miss very few calls.** Count the calls that rang out last month first. If the number is tiny, a build may not pay for itself. My [pricing page](/pricing/) shows what a build costs, so you can compare. Ours is $0 to set up and $397 a month with 500 minutes, and 15¢ a minute after that. If it doesn't catch at least 10 missed calls in the first 30 days, you don't pay.
- **Nobody will read the first live calls.** Someone has to check them in week one.

## Checklist before you start the clock

How the paths compare (only the FCC figure is a published duration):

- **Forwarding:** no port needed, so there is no porting wait.
- **Trunk:** the Retell steps above, then both test calls.
- **Simple port:** one business day under the FCC rule.
- **Complex port:** longer than one business day. Ask your carrier for its date in writing.
- **With text-back:** add registration, with no published approval time.

Then the steps to take:

- Find out who your phone carrier is, and ask whether your number is a simple port.
- Decide between forwarding and keeping the number on a trunk.
- Write down the three calls you get most.
- Decide which calls always go to a person.
- Ask your builder to start text registration early if you want text-back.
- Block an hour to call the demo and write down every change you want.

When you are ready, [call the Blue Ridge recovery demo](https://voicedesk-h31g.onrender.com/agent/recovery). It answers in about 1 second.
