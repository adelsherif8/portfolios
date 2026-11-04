---
title: How to hire a Vapi or Retell developer: what to check before you pay
seo_title: Hire a Vapi or Retell developer: checks before you pay
description: How to hire a Vapi developer or Retell builder: seven checks on accounts, webhooks, testing and cost, plus when a template is enough and you can skip them.
date: 2026-11-04
slug: hire-vapi-retell-developer
service: /voice-agent-engineer/
service_label: Vapi and Retell voice agent developer
tags: hire vapi developer, retell, voice agents
target: hire vapi developer
---
To hire a Vapi developer you can trust, ask for a live number you can call, put the Vapi or Retell account in your own name, and ask how they test. A good one answers all three in plain words.

Below are seven checks, what a good answer sounds like, and when you can skip the developer. Each check is a question you can ask on a call.

## What are you actually paying a developer for?

Not the platform. Vapi and Retell give any developer the same voice, phone and model plumbing. Retell lists its [base voice engine at $0.055 a minute](https://www.retellai.com/pricing). Vapi lists [$0.05 a minute for hosting](https://vapi.ai/pricing).

The developer's work sits around that plumbing:

- the prompt and the conversation design
- the tools the agent calls mid-call, such as "book this slot"
- the server code behind those tools
- the tests that show it works before a real customer calls

That is where agents fail, and it is what you should inspect.

## How do you hire a Vapi developer without getting burned?

Run these seven checks before you pay a deposit.

### 1. Can you call something they built?

Ask for a number to phone, not a video. A recording shows the best take. A live line shows how it handles interruptions, a wrong answer and a caller who changes their mind.

I keep seven demos live for this reason: [recovery](https://voicedesk-h31g.onrender.com/agent/recovery), dental, restaurant, realty, receptionist, support and voicemail. Call one, interrupt it, ask something odd. If a developer has no live agent to show, ask why.

### 2. Whose name is on the account?

The Vapi or Retell account, the phone number and the CRM keys should all be yours. If the developer holds them, you cannot leave without rebuilding. Ask in writing: "If we part ways, do I keep the agent, the number and the prompts?"

### 3. Do they write server code, or only click through the dashboard?

Dashboard-only agents can answer questions. Agents that book, look up a customer or take a payment need a server that the platform calls mid-conversation.

Ask what that server does when something goes wrong.

Vapi's docs say a tool endpoint must [always respond with HTTP 200, even when reporting a failure](https://docs.vapi.ai/tools/custom-tools). Any other status code is ignored, so your error message never reaches the agent. Ask what happens on a call when your calendar is down.

## How do you check security and testing?

### 4. Do they verify who is calling their webhook?

The server address is just a web URL, so the server needs a way to tell real platform requests from fake ones. Retell signs each webhook, and its docs say to [check an HMAC-SHA256 signature and reject requests more than 5 minutes old](https://docs.retellai.com/features/secure-webhook).

You do not need to understand the cryptography. Ask: "How does your server know a request really came from the platform?" On Retell the answer should mention the signature. "We trust the URL" is a bad answer.

### 5. How do they test before launch?

This is the check that separates builders. A developer who tests by calling the agent a few times will miss the rare, expensive failures.

Retell's simulation testing is a good yardstick. Its docs say a batch [runs each selected case exactly once](https://docs.retellai.com/test/llm-simulation-testing). The same page [advises rerunning before you trust a single failure](https://docs.retellai.com/test/llm-simulation-testing). Ask how many times each scenario runs and what counts as a pass.

My own suite has 38 simulated callers and makes 114 calls per run, for about $0.25 a run. Its first run caught 5 missed emergency handoffs in 41 plumbing calls on a cheaper model. In those five calls the caller had an emergency and the agent did not hand the call to a person. The full method is in [how I test AI phone agents](/blog/how-we-test-ai-phone-agents/).

## How do you check emergencies and cost?

### 6. What happens on an emergency or a request they can't handle?

Ask for the escalation rules in writing.

Which words trigger a transfer to a person? What happens at 2am when nobody picks up the transfer? The answer should name a number, a text or a fallback message. "The AI will figure it out" fails this check.

### 7. Can they price the running cost, not just the build?

A build fee is one number. The monthly cost has several parts:

- platform minutes
- the voice and the language model
- phone line charges
- changes after launch

Retell shows a [range of $0.07 to $0.31 a minute](https://www.retellai.com/pricing) depending on the model and voice you choose. Vapi [bills speech recognition, the model and the voice on top of its hosting fee](https://vapi.ai/pricing). A developer should tell you the per-minute total for your setup and what happens when you go over.

Compare any quote to this shape: a build price, a monthly price, the minutes inside it and the rate after. Mine is $900 to build and $450 a month with 500 minutes, then 15 cents a minute ([pricing](/pricing/)).

## What are the red flags?

- No live demo, only screenshots or a video.
- The developer wants to own your account or number.
- No answer on testing beyond "we call it and check."
- A quote with no monthly cost.
- Promises such as "it will never get anything wrong." No voice agent can promise that.
- Reviews or case studies that name no business and show no numbers.

## When don't you need a developer?

If you only want a greeting, your opening hours and a message taken, a template inside the platform or your CRM may be enough.

Hire someone when the agent has to do things: book into your calendar, read a customer record, take a payment, transfer a hot lead. Each of those needs server code and tests, and each is a place for a real customer to be hurt by a mistake.

Also hold off if your call volume is tiny. A business that gets a few calls a week may do better with a good voicemail greeting and a fast text back.

## Checklist before you sign

- Call a live agent they built, and interrupt it.
- Get the account, the number and the prompts put in your name, in writing.
- Ask what the server returns when a tool fails.
- Ask how it verifies webhooks.
- Ask how many times each test scenario runs, and what counts as a pass.
- Get the escalation rules for emergencies in writing.
- Get a monthly cost per minute, including what happens above the included minutes.

If you want one quote to compare, [book a fit call with me](/voice-agent-engineer/) and bring your answers to these seven.
