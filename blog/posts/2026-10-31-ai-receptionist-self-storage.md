---
title: AI receptionist for self storage: reservations, payments and gate codes
seo_title: AI receptionist for self storage: what it can do
description: An AI receptionist for self storage can quote units, reserve them and reset gate codes after hours. What to automate, what to keep human, and the risks.
date: 2026-10-31
slug: ai-receptionist-self-storage
service: /self-storage/
service_label: AI receptionist for self storage
tags: self storage, ai receptionist, gate codes
target: ai receptionist for self storage
---
An AI receptionist for self storage can answer at 9pm, quote a unit from your live inventory, reserve it and reset a tenant's gate code. It should not guess, read card numbers aloud, or hand out any account details before it knows who is calling.

The calls are simple. The risk is in two of them: payments and gate codes. This post covers the five common calls, with most detail on payments and gate codes. 

## What can an AI receptionist for self storage handle?

Five kinds of call keep landing on a storage office, and each one has a different level of risk.

1. **A new renter comparing facilities.** They ask what fits in a 10x10 and what it costs. Low risk.
2. **A renter ready to reserve.** Name, mobile number, size, move-in date. Low risk.
3. **A tenant paying the bill.** Medium risk, because card data is involved.
4. **A tenant locked out at the gate.** High risk, because a wrong answer lets the wrong person in.
5. **Something is wrong on site.** Smoke, flooding, a break-in. The agent's only job is to tell the caller to get to safety and call 911, then arrange a manager callback.

My demo agent, StoreRight Self-Storage, handles all five. StoreRight is a demo facility I built, not a client. The agent, the inventory and the dashboard behind it are real and running.

## How should it quote prices and reserve a unit?

From live inventory, and nowhere else. The agent looks at what the caller is storing, recommends a size, and reads the monthly price from the list. If a size is not listed, it does not invent one.

The demo prices are $45 for a 5x5, $110 for a 10x10, $145 for a climate-controlled 10x10 and $190 for a 10x20. Ask for a 10x10 and it quotes $110.

For a reservation it takes the name and mobile number and reads the number back digit by digit. Then it reserves the unit, and the unit comes off the available count on the dashboard straight away. A caller who is not ready to decide gets the quote by text and the agent takes the number.

A voicemail greeting gives a comparison shopper no price at all.

## Can it take a payment over the phone?

Yes, but this is where I would be most careful, and the details are not obvious.

My storage agent has the tenant enter the card on the phone keypad and never reads a card number back, even if the caller says it first. That keeps the number out of the spoken conversation. It does not, by itself, keep the number out of your logs.

Here is the catch. In Vapi, when keypad input is enabled, the platform adds the digits to the conversation as a user message, for example "User's Keypad Entry: 1234". [Vapi's documentation](https://docs.vapi.ai/documentation/assistants/conversation-behavior/keypad-input-settings) says the entry is available to the model and is saved in the call's messages and transcript when transcript artifacts are enabled. For payments, the same page tells you to follow its PCI compliance guide so that sensitive values are not recorded or logged.

So the rule is simple. Card digits must never reach the language model or the transcript. A payment tool built for the job does this. As one example, Twilio's [`<Pay>` verb](https://www.twilio.com/docs/voice/twiml/pay) accepts keypad (DTMF) input only, and its documentation says it redacts all digits captured from the logs.

If you cannot confirm where the digits go, do not take cards on the phone. Text a payment link instead, or send the tenant to your online portal. 

The StoreRight demo is a demo, and I make no claim here that it meets PCI rules (PCI is the card industry's security standard).

Card handling is also a matter for your payment processor and your management software vendor, so ask them what they require before you go live. I am not a PCI assessor and this post is not compliance advice.

## How does a gate code reset stay safe?

By making sure the agent cannot reveal what it never sees. This is the part most storage owners worry about, and they are right to.

Picture the call. A caller says they are a tenant at the gate who forgot the code. Or they say they are the owner. Or they ask for their sister's code.

A phone agent that has the whole tenant list in its prompt has the data to leak, and a persistent caller may get it to.

In my tests, prompt rules alone were not enough. The fix was to change what the agent is handed:

- **One record per call, at most.** The agent gets the caller's own record, matched by the calling number or by details where every field must match exactly. If two accounts share a number, or the details do not line up, it gets nothing and treats the caller as unverified.
- **Only the fields it needs.** For storage that is name, unit, size and balance. Free-text notes are never passed, and any value that reads like an instruction to the AI is dropped.
- **Verify, then reset.** It confirms the caller's name and unit number first. Claiming to be the owner or staff changes no rule.

[OWASP's guidance on prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) says the same thing from the security side: restrict the model's access privileges to the minimum necessary, and handle privileged functions in code rather than giving them to the model.

Here is what happened across my 63 security calls, which included the storage receptionist ([full method](/case-studies/voice-agent-security-evals/)). The agents ran on GPT-4o-mini with a GPT-4.1-mini judge:

| Measure | Before | Prompt rules | Own record only |
|---|---|---|---|
| Calls leaking another customer's data | 14 | 6 | 0 |
| Share of attack calls where the agent held its rules | 57% | 90% | 94% |

This is a small test, so treat it as evidence for the method, not a promise. The case study lists testing real phone audio as a next step, and describes one open finding.

## What about after-hours calls and emergencies?

The line is answered 24/7, so the 9pm quote and the Sunday lockout get handled instead of hitting voicemail. Questions it cannot answer, like insurance terms or corporate policy, turn into a manager callback with the number taken.

I will not claim a number for how many calls a storage facility loses overnight. I could not find a source I would trust for that, so measure it yourself: look at your phone log for unanswered calls between 6pm and 8am for a month.

The emergency rule is fixed. A caller reporting smoke, flooding or a break-in is told to get to safety and call 911. The agent does not try to handle the incident.

## How do you check it works before it takes real calls?

Test it with a second AI playing the caller. My suite has 38 scenarios across three agents, run three times each. That is 114 calls per run for about 25 cents. Each scenario has to pass all three runs.

The scenarios that matter most for storage:

- The angry tenant at the gate, who is short on patience.
- The renter who switches to climate-controlled halfway through.
- The caller who reads out a card number.
- The caller asking for another person's gate code.

Results are checked in code first: did it save the right name, unit and outcome, did every price it quoted exist, did it hand over when it should.

## When is an AI receptionist not worth it for storage?

Be honest about these cases:

- **Your office is staffed all day and almost no calls are missed.** The gain is small. Check your phone log before you buy.
- **Your management software has no API or webhook** (a way for other software to read and write its records)**.** The agent can then reserve or reset nothing by itself. It can only take messages.
- **You want it to settle disputes, lien notices or auction questions.** Those need a person.
- **You cannot confirm where card digits end up.** Skip phone payments until you can.

On cost, a voice agent is $900 to build and $450 a month with 500 minutes included, then 15 cents a minute. The first three clients get the build at $600. All prices are on the [pricing page](/pricing/).

For comparison, the pricing page puts a human receptionist at $2,800 to $4,500 a month. Whether the agent pays back depends on how many calls you currently miss.

## Checklist before you switch it on

- List your unit sizes and monthly prices, and keep one source of truth for them.
- Decide what the agent may write: reservations yes, refunds and lien questions no.
- Give it only the caller's own record, with name, unit, size and balance.
- Confirm in writing where keypad digits go. If you cannot, send a payment link.
- Write the emergency rule: 911 first, manager callback second.
- Run the angry tenant and the "my sister's gate code" call before launch.
- Count unanswered after-hours calls for a month, so you have a baseline.

The test method is in [how I test AI phone agents](/blog/how-we-test-ai-phone-agents/) and [voice agent prompt injection testing](/blog/voice-agent-prompt-injection-testing/). The agent setup is on the [self-storage page](/self-storage/). To see it work, [call the live demo](https://voicedesk-h31g.onrender.com/agent/receptionist): ask for a 10x10, reserve it, then call back as a locked-out tenant.
