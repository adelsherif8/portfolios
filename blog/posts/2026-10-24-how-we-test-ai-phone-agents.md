---
title: How we test AI phone agents before they take real calls
seo_title: How we test AI phone agents before real calls
description: We run every AI phone agent against 38 simulated callers before launch. What we measure, the mistakes it catches, and why "it sounded fine" is not a test.
date: 2026-10-24
slug: how-we-test-ai-phone-agents
service: /voice-agent-engineer/
service_label: How we build voice agents
tags: testing, ai voice agents, quality
---
An AI phone agent that sounds great in a demo can still fail on the one call that matters: the angry customer, the emergency, the caller who asks something it was never told. You only find out which kind you have by testing it on purpose, before your customers do it for you.

This is how we test every agent before it goes live. The results are public: you can see the latest run on our [agent QA console](https://voicedesk-h31g.onrender.com/evals).

## Why a few test calls are not enough

Language models are not deterministic. The same question can get a slightly different answer each time. So an agent that handled your three test calls perfectly can still mishandle the fourth. And the calls people test with are usually the easy ones: "I'd like to book an appointment."

Real callers interrupt, change their mind halfway through, refuse to give a phone number, ask if they are talking to a robot, or call at 2am with water coming through the ceiling. Those are the calls worth testing.

## Simulated callers

Instead of making test calls by hand, we have a second AI play the caller. Each simulated caller gets:

- **A persona and a goal**, for example "a stressed homeowner with a burst pipe who wants someone today".
- **Facts it only reveals when asked**, such as the address or the unit number, so we can check the agent actually asks.
- **Behaviours that make it harder**: rushing, getting angry, interrupting, speaking in short broken sentences, refusing details.
- **The outcome that counts as success**, for example "an emergency booking, or a transfer to the on-call number".

Our current suite has **38 of these scenarios across three agents**: a dental front desk, a plumbing dispatch line and a self-storage receptionist. Every scenario runs three times, because one lucky pass proves little. That is 114 calls per run, and a full run costs about 25 cents.

## What we check

Wherever possible, a simple program checks the result, not another AI. Did the agent call the booking tool? Did it save the right name, phone number and time? Did every price it quoted actually exist in the price list? Did it hand over to a human when it should have, and only then?

An AI judge is used only for what code cannot check, such as whether the tone fit the situation or whether a free-text answer was actually true. It gets a written rubric and has to give a one-line reason for every verdict.

## The numbers that matter

- **Containment**: the share of calls the agent resolved completely on its own. A caller hanging up early never counts as contained. That is the most common way this number gets inflated.
- **Correct versus unnecessary transfers**: handing over to a person is good when it is needed, and costly when it is not.
- **Missed handoffs**: the scenario needed a human, for example an emergency, and the agent kept going alone. We treat this as a critical failure.
- **Hallucination rate**: calls where the agent stated a price, time or fact that is not in its data.
- **Consistency**: a scenario only passes if it passes all three runs.

## What it caught

The first full run caught something no demo would have shown: on the cheaper language model, our plumbing agent **missed the required emergency handoff in 5 of 41 calls**, including a caller reporting a gas smell. It sounded calm and helpful the whole time. It just did the wrong thing.

That is the point of testing. A gas leak is exactly the call where "it sounded fine" is not good enough.

## Testing every change

Every time we change an agent's script or switch the model, the suite runs again and compares the results with the previous baseline. If a scenario that used to pass starts failing, or containment drops, the change is blocked until it is fixed. It works like the automated tests a software team runs before every release.

## What this means if you are buying one

Ask whoever builds your agent how they test it. If the answer is "we called it a few times", you are the test. Ask to see the emergency scenarios specifically, and ask what happens when the agent does not know the answer.

You can [talk to our plumbing agent](https://voicedesk-h31g.onrender.com/agent/recovery) and try to break it yourself, or read [what an AI receptionist costs](/blog/ai-receptionist-cost-2026/) before you decide.
