---
title: How an AI phone agent handles emergency calls safely
description: How an AI phone agent should handle emergency calls: tell the caller to leave, transfer to a person, never improvise. Tested numbers and when not to use one.
date: 2026-11-18
slug: ai-phone-agent-emergency-calls
service: /plumbing/
service_label: AI phone agents for plumbing and HVAC
tags: emergency calls, ai phone agents, call transfer
---
For danger to people, an AI phone agent should tell the caller to get out and call 911. For danger to property, it should book the slot or transfer to a person. Both rules need to be written down and tested before launch, not left to the model's judgment.

## What counts as an emergency for a phone agent?

Whatever you define in advance, and nothing else. Split calls into two groups before you write a single prompt line.

- **Danger to people:** a gas smell, smoke, a carbon monoxide alarm, a medical problem. The agent is not the help here. Its job is one safety sentence telling the caller to get out and call 911. It dispatches nothing.
- **Danger to property:** a burst pipe, a flooded basement, no heat in a freeze. These are urgent, but a booked slot or an on-call transfer is a correct answer.

Write the trigger phrases and the action for each. "I smell gas", "smoke in the house" and "carbon monoxide alarm is going off" go in the first group. "Pipe burst", "basement is flooding" and "water coming through the ceiling" go in the second.

Single words like "smell" or "alarm" fire on a musty basement or a low-battery chirp.

## What should the agent say first?

The safety instruction, before any question about your calendar.

Take a gas smell. Two state regulators give the same sequence.

Wisconsin's utility regulator says to [leave the area immediately](https://psc.wi.gov/Pages/ServiceType/Energy/PipelineSafety/NaturalGasConsumerSafety.aspx) and, from a safe distance outdoors, call the gas utility's emergency number or 911. It also says not to use cell phones, lights, appliances or cars near a suspected leak.

Pennsylvania's utility commission tells people to [call 9-1-1 and the gas utility from a safe distance, away from the odor](https://www.puc.pa.gov/pipeline-safety/gas-emergencies/), and not to make calls from a phone while still at home.

Notice what that means for a phone agent. The caller may be standing in the leak. So the right script is short:

1. "If you smell gas, leave the building now."
2. "Call 911 and your gas company from outside."
3. End the call. Any follow-up from the plumber happens only after the caller is safely outside.

No address collection, no quote, no "let me check availability". The agent does not dispatch 911 and must never imply it did. For carbon monoxide and medical calls, the agent should say only to call 911. The 911 advice here is for US callers. 

## What does a property emergency call look like?

Here is an example scenario, not a client call.

A caller says water is coming through her kitchen ceiling. The plumbing agent described on my plumbing page asks the safety questions first: is the water off, is there standing water, is anyone at risk.

Then it follows the rules set for the business: book the emergency slot, or transfer to the on-call number. It quotes the dispatch fee it was given and nothing more.

Safety questions first, logistics second, price last is the order I recommend for your own prompt. As a suggestion for your own prompt: if the caller mentions a sagging ceiling near a light fixture, treat it as danger to people.

One safeguard worth copying: my Blue Ridge missed-call demo is a single-prompt Retell agent on GPT-4.1 that must call a `log_outcome` function before it hangs up. That is a prompt rule, not a guarantee, but it makes a missing outcome easy to spot. The demo recovers missed calls, so it is not an emergency line, but the rule carries over. You can [hear it here](https://voicedesk-h31g.onrender.com/agent/recovery).

## How does the hand-off to a person work?

You pick a transfer mode, and the modes behave differently. [Retell's transfer docs](https://docs.retellai.com/build/single-multi-prompt/transfer-call) describe three:

- **Cold transfer:** the call goes straight to the destination and the agent drops off.
- **Warm transfer:** the agent stays on the line after dialing, and can wait for a live person, whisper a brief or introduce the caller.
- **Agentic warm transfer:** a separate transfer agent calls the destination, screens who picks up, and bridges the caller or cancels. If it cancels, the caller returns to the main agent.

You also set how long the destination rings before the attempt counts as unanswered. The docs explain the ring-duration setting, but they state the timeout fallback only for the agentic mode. So ask your builder, and test it: what does the caller hear when the on-call phone goes to voicemail at 2am?

A transfer that fails silently is the worst case. The caller thinks help is coming. Decide the fallback in writing: a second number, a text to the owner, and an honest line to the caller ("I couldn't reach him, he will call you within 15 minutes"). Only promise a time the business keeps.

## What did my testing catch?

My test suite runs 38 simulated callers, 114 calls per run, for about $0.25 a run. On a cheaper model, its first run caught 5 missed emergency handoffs in 41 plumbing calls, including a gas-smell caller. The pass condition for that scenario is that the agent tells the caller to get out and call for help, so a missed handoff there means it did not do that. Full method in [how I test AI phone agents](/blog/how-we-test-ai-phone-agents/).

One honest limit: those agents have no live transfer tool in the suite yet, so "handoff" there means an escalation outcome. It does not prove a ringing phone gets answered. Test the real transfer with real phones before launch.

## When should an AI agent not take emergency calls?

- **Anything medical or life-threatening.** The caller should dial 911. The agent can say so, nothing more.
- **No one owns the on-call phone.** A transfer to a number nobody answers is worse than voicemail with a clear message.
- **Your emergencies are hard to define.** If your team argues about what counts, the prompt will too. Settle it first.
- **You already run a staffed on-call line that people answer.** Your emergency tier is covered. Use the agent for the routine calls, as in [after-hours calls home-service businesses lose](/blog/after-hours-calls-home-service/).
- **Call volume is tiny.** If emergencies are a handful a year, a good voicemail greeting plus a forwarded number costs less than [$397 a month](/pricing/) for Missed-Call Recovery (500 minutes included, then 15¢ a minute).

## What happens when the agent doesn't know?

Treat "unsure" as "emergency". An agent that cannot place a call should transfer it, not guess.

I cover the general case in [what happens when an AI receptionist doesn't know the answer](/blog/ai-receptionist-doesnt-know-the-answer/).

My first test run caught 5 missed emergency handoffs, and that was one run on a cheaper model.

## Checklist before you let an agent near your emergency line

- Write the two lists: danger to people, danger to property, with trigger words.
- Write the first sentence for each, and the action: instruct, book or transfer.
- Pick a transfer mode and set the ring time.
- Write the fallback for an unanswered transfer, and test it by letting the phone ring out.
- Run at least 10 emergency scenarios, 3 times each, with a gas smell among them.
- Read 20 real emergency calls in the first week, before you trust the average.

When your rules are written, the [plumbing and HVAC page](/plumbing/) shows the safety questions and transfer rules my agent follows.
