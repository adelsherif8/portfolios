---
title: How we test AI phone agents before they take real calls
seo_title: How to Test AI Voice Agents Before Launch: 38 Scenarios
description: How to test an AI phone agent before launch: hard scenarios, repeat runs and code checks. Our 38-scenario numbers, what CI runs, and what text misses.
date: 2026-10-24
slug: how-we-test-ai-phone-agents
service: /voice-agent-engineer/
service_label: How we build voice agents
tags: testing, ai voice agents, quality
---
To test an AI phone agent before launch, write hard caller scenarios, run each one several times, check the results in code where you can, then make real phone calls. Our main suite does the first three: 38 scenarios across 3 agents, three runs each.

That suite caught a problem no demo showed. Below is how it works, what our CI really runs, what text tests miss, and how to do the same with off-the-shelf tools.

## Why a few test calls are not enough

Language models are not deterministic. The same question can get a slightly different answer each time. An agent that handled your three test calls well can still fumble the fourth.

The calls people test with are also the easy ones: "I'd like to book an appointment." Real callers interrupt, change their mind, refuse to give a number, ask if they are talking to a robot, or call at 2am with water coming through the ceiling. Those are the calls worth testing.

## How do simulated callers work?

A second AI plays the caller. Each scenario gives it:

- **A persona and a goal**, for example "a stressed homeowner with a burst pipe who wants someone today".
- **Facts it reveals only when asked**, such as the address, so we can check the agent asks.
- **Behaviours that make it harder**: rushing, anger, interrupting, refusing details.
- **The outcome that counts as success**, for example "the agent tells a caller who smells gas to get out and call for help".

The main suite has **38 scenarios across three agents**: a dental front desk, a plumbing dispatch line and a self-storage receptionist. Each runs three times, because one lucky pass proves little. That is 114 calls per run, at about 25 cents a run. The repo now also holds 21 security scenarios on top of those, 59 in all.

The agents run on GPT-4o-mini in these tests and a GPT-4.1-mini model acts as the judge. The Blue Ridge plumbing demo agent itself is set up on GPT-4.1, so a test pass does not transfer to it automatically. Baselines are kept per model for that reason.

## What do we check, and who checks it?

Where possible, plain code checks the result, not another AI:

- Did the agent call the tool that saves the call?
- Did it save the required fields, such as the outcome and the time?
- Was every dollar amount it said in its data?
- Did it hand off when it should have, and only then?

Two limits on those checks. These agents have no live transfer tool yet, so a "handoff" here means an escalation outcome, such as an emergency booking or a staff callback. And the plumbing agent's prompt never asks for a name, so it can save "Customer". We show that as a known gap, and name and phone do not fail its calls.

An AI judge handles only what code cannot, such as tone, or whether a free-text answer was true. It works from a written rubric and gives a one-line reason for every verdict.

## Which numbers matter?

- **Containment**: calls the agent resolved on its own. A caller hanging up early never counts. That is the usual way this number gets inflated.
- **Correct versus unnecessary transfers**: a handoff is good when needed and costly when not.
- **Missed handoffs**: the call needed a human, such as an emergency, and the agent kept going. We treat this as a critical failure.
- **Hallucination rate**: calls where the agent stated a price, time or fact not in its data.
- **Consistency**: a scenario passes only if it passes all three runs.

## What did the first run catch?

On the cheaper model, our plumbing agent **missed the required emergency handoff in 5 of 41 calls**, including a caller reporting a gas smell. It sounded calm and helpful the whole time. It just did the wrong thing.

A security track found a second kind of problem. Prompt rules cut calls that leaked another customer's details from 14 to 6. Giving each agent only the caller's own record took that to 0, and injection resistance rose from 57% to 94%.

The full numbers and method are in the [voice agent security evals case study](/case-studies/voice-agent-security-evals/), which is the source for every figure on this page. Published runs are on the agent QA console, linked at the end.

## What does CI run, and what does it not run?

CI does not run the full suite. A GitHub Actions job runs **8 scenarios tagged "smoke", once each**, at about 2 cents a run with a 10-cent cap. The full suite is a separate command we run by hand.

The smoke job starts only on non-draft pull requests that touch these paths, or when started by hand:

- the prompt document (`docs/RETELL-SETUP.md`)
- the agent registry data (`app/agents.py`)
- eval agent configs, scenarios or baselines

So a change elsewhere, such as the live model name in the provisioning script, does not start it. Without an OpenAI key set in the repo, the job skips instead of failing.

It compares results with the saved baseline and fails the pull request's check when a smoke scenario that passed now fails, a new missed handoff appears, or a call has a security critical. Containment is not gated here. The code only gates it at 10 or more shared calls, and 8 calls is too few to mean much.

A failed check flags the change. Whether it can be merged anyway depends on the repo's branch rules, so treat this as a tripwire, not proof. After a real prompt change, the full suite is still the test that counts.

## What does this test not catch?

Be clear about the limits. The suite runs in **text mode**. The agent reads and writes text, not audio. So it does not catch:

- **Speech recognition errors**, such as a misheard phone number or street name.
- **Latency**, the pause before the agent replies.
- **Barge-in**, when a caller talks over the agent.
- **Phone-line problems**, such as bad audio or a dropped call.

Simulated callers are also models, and they can be more cooperative than real people. A text pass on a cheaper model is a smoke test, not proof. Before launch, someone still has to make real calls on a real phone, with background noise and interruptions.

## How to do this yourself

You do not need to build a suite from scratch. Each option has trade-offs.

- **Vapi.** Vapi has [Evals and Simulations](https://docs.vapi.ai/test/voice-testing). Evals check one decision at a fixed point in a conversation, in text only. Simulations use an AI tester as the caller and can run in chat or voice. Vapi says chat runs are faster and cheaper, and that "synthetic callers do not fully represent real callers".
- **Retell.** Retell has [simulation testing](https://docs.retellai.com/test/llm-simulation-testing), which "runs as a text conversation" with an AI playing the caller. You write a caller prompt and success criteria, and can mock your function results. Its [batch tests](https://docs.retellai.com/test/batch-test-simulation) run many cases and report a pass rate. Like ours, it will not hear speech problems.
- **A third-party tool.** [Cekura](https://www.cekura.ai/) runs synthetic conversations before release, can gate deploys on the suite, and monitors live calls for drift. It costs extra and you still write the scenarios that matter to your business.

The trade-off is the same everywhere. Built-in tools are quick to start and tied to one platform. A separate suite takes longer to build but tests across platforms and lets you write checks in code.

## What this means if you are buying an agent

Ask whoever builds your agent how they test it. If the answer is "we called it a few times", you are the test. Ask to see the emergency scenarios, and what happens when the agent does not know the answer. Testing is part of every build on our [voice agent page](/voice-agent-engineer/), and it is priced in on the [pricing page](/pricing/).

## Checklist before an agent goes live

1. Write 10 or more hard scenarios, including at least one emergency.
2. Run each scenario three times. Pass only if all three pass.
3. Check bookings, saved fields and prices in code, not by ear.
4. Count missed handoffs as critical failures.
5. Rerun the full suite after every prompt or model change, not only a small CI subset.
6. Make real phone calls to test speech, pauses and interruptions.

The next step, if you want to see real passes and failures first, is the [agent QA console](https://voicedesk-h31g.onrender.com/evals).
