<!--
Draft, not published. Best score 85 (automatic 50 + review 35), round 3 of 3. Earlier rounds: 83, 84.
TOP 3 FIXES from last review:
1. Replace "days or weeks" in the opening with supportable cases (forwarding depends on carrier plan; a port depends on whether it is simple). Delete the invented evening/morning scenario or use a real client timeline.
2. Say the SIP trunking/firewall/Retell steps describe Retell's docs, not Adel's setup. Soften "The rule says nothing about complicated numbers" to "covers simple ports only, ask your carrier". Use Twilio's own wording.
3. Fix "Two things" to match the content (approval, number connection, text registration). Rename the "step 4" heading. Cut the pricing paragraph into one closing line with a single soft CTA. Trim internal links to the two most useful.
Note: topic lacks first-hand go-live timeline data; a real client timeline would lift Original value.
-->
---
title: How long does it take to set up an AI phone agent?
description: A demo number you can call takes about 48 hours. Going live on your real line takes longer, because your number and your approval set the pace.
date: 2026-11-13
slug: how-long-to-set-up-ai-phone-agent
service: /voice-agent-engineer/
service_label: AI voice agent build
tags: ai phone agent, setup, voice agents
---
A demo number you can call comes within about 48 hours. Going live is the day you approve the script and your own phone number is connected to the agent, so it can be days or weeks depending on you and your carrier.

Treat "demo" and "live" as two separate milestones, and ask any builder for a date on each.

## What happens in the first 48 hours?

On my [voice agent page](/voice-agent-engineer/) the process has four steps:

1. **You tell me the three calls you get most.** Have your hours, services, prices and the place bookings should land ready.
2. **I build and test it.** The agent runs against 20 scripted calls before you hear it.
3. **You call it yourself.** You get a demo number before go-live, and you change the script until it sounds right.
4. **Go live and hand over.** It runs on your number and your hours.

The 48 hours is the wait for the first demo number from step 3. Step 4 starts after you are happy with the script.

## What decides how long step 4 takes?

Two things, and neither is the AI. Your carrier controls the second.

**Your approval.** Each script change after you call the demo waits for you to listen and reply. A day of silence is a day added.

**Your phone number.** The agent must receive calls on the number your customers already dial. How that connects depends on your carrier, and the next two sections cover the options.

A realistic example, built only from the steps above: the demo arrives in about 48 hours, you call it that evening, and send changes the next morning. If the agent can take your number by forwarding, go-live follows your approval. If the number must port, go-live waits on the carrier.

## How do you connect your existing business number?

The simplest idea is call forwarding: your carrier sends calls to the agent's number. Ask your carrier whether your plan supports it.

The other route keeps your number where it is and connects it to the agent platform. On Retell this is called SIP trunking, which is a way for a phone provider to pass calls over the internet to another system. The [custom telephony guide](https://docs.retellai.com/deploy/custom-telephony.md) lists the steps:

- Point your provider's trunk at Retell's SIP address.
- Enter your provider's termination address in Retell, plus a username and password if your provider uses them.
- Allow Retell's IP ranges through your provider's firewall. The page notes that many providers require this.
- Use **Test SIP Connection**, then save the number.

Then comes the step that is easy to skip. The same page says a passing connection test does not verify call behavior. It tells you to place an outbound call and receive an inbound call to confirm routing and audio. Do both before you call it done.

## What if the number has to move to a new carrier?

Moving a number is called porting, and I cannot speed it up. The FCC reduced the interval for simple wireline-to-wireline and simple intermodal ports to [one business day](https://www.govinfo.gov/content/pkg/FR-2009-07-02/pdf/E9-15132.pdf), effective August 3, 2009. It is a 2009 rule, and it covers simple ports only.

The rule says nothing about complicated numbers, so ask your carrier whether yours counts as simple before anyone promises you a launch date.

## Does the text-back add time?

If the agent also texts callers, the texts need registration. Twilio says anyone sending texts over a normal 10-digit US number [must register for A2P 10DLC](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc), by creating a brand (who is sending) and a campaign (what the messages are for).

Twilio's page gives no approval time, so I will not invent one. Ask your builder about it at the start, so it does not surprise you at go-live.

## Why not skip testing to go live faster?

Because testing is where the real problems show up. My suite runs 38 simulated callers and 114 calls per run, for about $0.25 a run. Its first run caught 5 missed emergency handoffs in 41 plumbing calls on a cheaper model. I describe the method in [how I test AI phone agents](/blog/how-we-test-ai-phone-agents/).

Retell has a built-in version. Its [simulation testing](https://docs.retellai.com/test/llm-simulation-testing) runs an AI caller against your agent and grades each run pass or fail. The page advises judging a scenario by its pass rate over several reruns, because the caller and the grader are both AI models.

Before launch, run your own check. Call the agent ten times, ask for something it does not know, interrupt it, and try an emergency. I cover what it should do then in [what an AI receptionist does when it doesn't know the answer](/blog/ai-receptionist-doesnt-know-the-answer/).

## When is fast setup the wrong goal?

- **You have not decided what the agent may do.** If you cannot say which calls it books and which go to a person, a fast build gets you a fast mistake.
- **Your prices or menu change often and nobody will update them.** The agent only knows what it was given.
- **You miss very few calls.** Count the calls that rang out last month first. If the number is tiny, a build may not pay for itself. My [cost breakdown](/blog/ai-receptionist-cost-2026/) shows the numbers to compare.
- **Nobody will read the first live calls.** Someone has to check them in week one.

## Checklist before you start the clock

- Find out who your phone carrier is, and ask whether your number is a simple port.
- Decide between forwarding and keeping the number on a trunk.
- Write down the three calls you get most.
- Decide which calls always go to a person.
- Ask your builder to start text registration early if you want text-back.
- Block an hour to call the demo and write down every change you want.

Cost is on the [pricing page](/pricing/): a $900 build, then $450 a month with 500 minutes included and 15 cents a minute after that. The first three clients get the build at $600.

When you are ready, [call the Blue Ridge recovery demo](https://voicedesk-h31g.onrender.com/agent/recovery). It answers in about 1 second.
