---
title: How to measure whether your AI receptionist is working
seo_title: How to measure whether your AI receptionist works
description: Five numbers tell you if your AI receptionist works: answered calls, outcomes logged, hand-offs, bookings and wrong answers. Where to find each one.
date: 2026-11-22
slug: measure-ai-receptionist-working
service: /voice-agent-engineer/
service_label: AI voice agent build
tags: ai receptionist, call analytics, monitoring
---
Track five numbers: how many calls it answered, how many calls ended with a logged outcome, how many it handed to a person, how many turned into bookings, and how many answers were wrong. The first four come from your call log. The fifth only comes from a person reading calls.

Do not rely on the platform's "call successful" flag alone. It is a model's opinion of a transcript, not a count of jobs.

## Why is "calls answered" not enough?

An agent that picks up every call can still fail every caller. It can answer, chat, quote a price you never set, and hang up with no booking.

So the first number is only a floor. Pull it from your call log, then ask what happened on each call.

A made-up plumbing example: 60 calls in a week, all answered. That tells you the phone worked. It does not tell you whether 12 or 2 of those callers booked a visit.

## What are the five numbers?

1. **Answered rate.** Calls the agent picked up, divided by calls that came in. Count calls that dropped before the greeting separately.
2. **Outcome logged.** Calls that ended with a recorded result: booked, message taken, transferred, or not a customer. A call with no outcome is a call you can't count.
3. **Hand-off rate.** Calls passed to a person. Watch for sudden changes, and read the calls behind them.
4. **Booking rate.** Calls that ended with an appointment, out of the calls that were real customers.
5. **Wrong-answer count.** Calls where the agent said something untrue about your business. Aim for zero, and read the calls to find out.

## Where do these numbers come from?

Most voice platforms do part of this work for you. Retell's [post-call analysis](https://docs.retellai.com/features/post-call-analysis-overview) writes results onto each call after it ends. The default fields are a summary, the caller's sentiment, whether the call met your success criteria, and whether the agent reached a voicemail. You can add your own fields, such as a yes/no "booked" or a pick-one "reason for call."

Vapi's [call analysis](https://docs.vapi.ai/assistants/call-analysis) offers the same idea: a summary, structured data pulled out by a JSON schema, and a success evaluation with scoring rubrics.

Two limits matter. Retell notes that sentiment comes from the transcript and "does not use tone or pitch," so an angry voice reading polite words can look fine. And, per the same page, custom fields are not filled in for calls that were not connected.

Timing matters too. Retell's [webhooks](https://docs.retellai.com/features/webhook-overview) send `call_ended` when a call completes, and `call_analyzed` later, once analysis is done. Only the second carries the analysis. If you build a report, listen for the second one.

## How do you make "booked" a fact and not a guess?

Don't ask a model to judge from the transcript whether the call went well. Make the agent record what happened.

In my Blue Ridge missed-call demo, a single-prompt Retell agent on GPT-4.1, the agent must call a `log_outcome` function before it hangs up. The lead then moves through a pipeline: Missed, Texted, Called, Booked. Every stage is a count you can read, and a call with no logged outcome stands out.

That is a prompt rule, so it can fail. Count it. If 3 calls out of 40 have no outcome (made-up numbers), you have found a gap in the prompt before a customer finds it.

You can [hear that agent on the recovery demo](https://voicedesk-h31g.onrender.com/agent/recovery). In that demo the text-back goes out in 8 seconds and the AI callback connects in 52.

## What does a good week look like?

I won't give you a benchmark, because I have no honest one to give. A plumber's emergency line and a dental front desk should look very different. Set your own baseline in week one, then watch for change.

Here is a made-up example, labeled as made up. In week one, 50 calls: 48 answered, 44 with a logged outcome, 9 hand-offs, 14 bookings. That is a baseline. If next week shows 30 with a logged outcome, something broke, even if answered calls stayed high.

Read the hand-offs more than the bookings. A hand-off means the agent decided it could not help. Your [emergency policy](/blog/ai-phone-agent-emergency-calls/) and your [fallback for unknown questions](/blog/ai-receptionist-doesnt-know-the-answer/) both show up there.

## How do you catch wrong answers?

You cannot count them from a dashboard. A success flag is a model's opinion of the transcript, so a confident wrong price can slip through.

Do this instead:

- Read 10 calls a week. Pick two from each outcome: booked, message taken, transferred, no outcome, and one the platform marked unsuccessful.
- Read the unsuccessful ones first. They show where the prompt is weak.
- Write each wrong answer as a one-line rule or a new fact in the prompt, then replay the same call.

Before launch, I test with simulated callers. My suite runs 38 simulated callers, 114 calls per run, for about $0.25 a run. Its first run caught 5 missed emergency handoffs in 41 plumbing calls on a cheaper model. The agents in that suite run on GPT-4o-mini, with a GPT-4.1-mini judge.

OpenAI's GPT-4.1 [prompting guide](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide) says models are "inherently nondeterministic" and recommends "building informative evals and iterating often." The same applies to a phone agent: the same prompt can behave differently on a different call, so you measure it over many calls. My post on [how we test phone agents](/blog/how-we-test-ai-phone-agents/) explains the method.

## What should you compare it against?

An AI receptionist is working if it beats what you had before. So measure the old way first.

Before you switch it on, count for one week how many calls go unanswered and how many of those callers ever call back. That is your before number. Without it, a 14-booking week means nothing.

Then compare cost. Our Missed-Call Recovery is $0 to set up, then $397 a month with 500 minutes, and 15 cents a minute after that ([pricing](/pricing/)). Made-up break-even: if each extra job earns you $225 in profit, two extra jobs a month cover the $397 fee, and there's no setup fee to repay. If it books none, you have your answer.

## When is measuring not worth the effort?

If you get five calls a week, a dashboard is overkill. Listen to every call and skip the metrics.

Also, if you can't tell a real booking from a fake one, because your calendar is a mess or staff change bookings by hand, fix that first. No agent can look good against numbers you can't trust. In that case a human answering service may be the better choice.

## Checklist for the first month

- Write down your before number: unanswered calls in one week.
- Add a "booked" yes/no field and a "reason for call" field to the post-call analysis.
- Require a logged outcome before hang-up, and count the calls without one.
- Track answered, outcome logged, hand-offs and bookings in one weekly note.
- Read 10 calls a week, starting with the unsuccessful ones.
- Turn each wrong answer into a prompt fix, then replay that call.
- After four weeks, compare against your before number and decide if the agent stays.

If you want these fields set up on a [voice agent build](/voice-agent-engineer/), ask for the outcome logging first.
