---
title: What happens when an AI receptionist doesn't know the answer?
seo_title: What happens when an AI receptionist can't answer?
description: A well-built AI receptionist says it doesn't know, takes a message and logs the call. How to test that, and what a bad one does instead.
date: 2026-11-10
slug: ai-receptionist-doesnt-know-the-answer
service: /plumbing/
service_label: AI phone agent for plumbing and HVAC
tags: ai receptionist, escalation, testing
---
A well-built AI receptionist says it doesn't know, takes the caller's name and number, and logs the call for a person to follow up. A badly built one guesses, and a confident guess about a price or an opening time is worse than silence.

Which of the two you get depends on how the agent is set up, not on which brand of AI sits underneath. Here is what to check before it answers a real call.

## What should the agent do with a question it can't answer?

Three things, in order:

1. **Say so plainly.** "I don't have that information" is a fine sentence on a phone call.
2. **Offer the next step that exists.** A callback, a message to the owner, or a booking for someone who can answer.
3. **Record the question.** The business learns what callers ask that the agent could not answer, and can fix the gap.

Take a plumbing caller who asks, "Do you fix tankless water heaters from that brand?" If the agent was never told, the right reply is: "I'm not sure we service that model. I can have the office call you back this afternoon. What's the best number?" The wrong reply is a cheerful "Yes, absolutely."

## Why do AI agents guess instead?

A language model produces plausible text, and OWASP, the security project, [defines misinformation](https://genai.owasp.org/llmrisk/llm092025-misinformation/) as "false or misleading information that appears credible".

Two setups make this worse:

- **Too much freedom.** The prompt says "be helpful" and never says "only quote prices from the list below".
- **A knowledge base with no rule for empty results.** Retell's [knowledge base](https://docs.retellai.com/build/knowledge-base) retrieves 3 chunks by default, with a similarity threshold of 0.6. Its docs don't state what the agent does when retrieval finds nothing relevant. The docs suggest a prompt rule to answer only from the retrieved text. If nobody writes a rule like that, the model decides for itself.

## What does a good setup look like?

The [plumbing agent page](/plumbing/) describes an agent that quotes the dispatch fee and nothing it wasn't given. Anything outside its rules, urgent, or from an angry caller goes to a person, and the agent says so out loud.

My Blue Ridge recovery demo is a single-prompt Retell agent on GPT-4.1. It must call a `log_outcome` function before it hangs up, so every call is meant to end with a recorded outcome. In the GoHighLevel-style pipeline a card moves Missed, Texted, Called, Booked.

The useful design rule: the agent's way out must be as easy as guessing. Give it a one-step way to take a message, and the easy path is the honest one.

## How do you test what it does when it doesn't know?

Ask it things it cannot know, and count the guesses. My test suite uses simulated callers. It has 38 simulated callers and runs 114 calls per run for about $0.25 a run ([how I test AI phone agents](/blog/how-we-test-ai-phone-agents/)).

One check is a plain code check, not an opinion: was every dollar amount the agent said found in its data? A price that is not in its data gets flagged.

The checks that matter most for this question:

- **Invented facts:** the agent states a price, hour or service that is not in its data.
- **Missed handoffs:** the call needed a person and the agent kept going.

 On a cheaper model, my plumbing agent missed the required emergency handoff in 5 of 41 calls. The agent kept going when a person was needed ([case study](/case-studies/voice-agent-security-evals/)).

You can do a smaller version with a phone. Call your own agent ten times and ask: a price for a job you don't offer, whether you work Sundays when the hours say otherwise, whether the owner can call back in five minutes, and for another customer's address. Write down every answer that was not in the data.

## How does the hand-off to a person work?

It depends on the platform. Retell, for example, documents a [cold transfer](https://docs.retellai.com/build/single-multi-prompt/transfer-call), where the agent hangs up on the transfer, and a warm transfer, where the agent stays on the line. A warm-transfer wait setting defaults to 30 seconds. The page does not say what the main agent does after an unanswered transfer, so test that yourself.

Vapi has the same trap. On its [call forwarding docs](https://docs.vapi.ai/call-forwarding), a blind transfer to a busy or unanswered number on Twilio, Telnyx or Vonage ends the call. On other setups, the caller returns to the assistant only if a fallback plan is configured.

So "it transfers to a person" is half an answer. Ask what happens when nobody picks up.

One limit of my own tests: those agents have no live transfer tool yet. A "handoff" in my suite means an escalation outcome, not a live transfer. If you need the call to ring a human mid-conversation, ask any builder to demonstrate it on a phone, not in a screenshot.

## When is an AI receptionist the wrong choice?

- **Most of your calls are unusual.** If every caller has a custom question, such as a contractor quoting commercial jobs, an agent will escalate nearly every call. You have bought an expensive message taker.
- **Nobody will read the callback list.** An agent that says "someone will call you back" creates a promise. If the promise is not kept, you are worse off than with voicemail.
- **Your information changes daily.** Prices, stock or availability that live only in your head cannot be read by an agent. Someone has to keep its data current.
- **The call needs judgment and trust,** such as a complaint about a bad repair. Send it to a person.

An agent pays off when most calls are routine and a person handles the rest.

## What should you ask a builder before you sign?

- What does the agent say when a question is not in its data? Ask to hear it.
- Is there one step to take a message, and where does the message go?
- Does every call end with a saved outcome, even when the agent could not help?
- Does the builder test for invented prices, and can they show the results?
- Who updates the agent's data when your prices change?
- What does it cost? Mine is $900 to build and $450 a month with 500 minutes, then 15¢ a minute ([pricing](/pricing/)).

If you want to hear a live agent first, [call the Blue Ridge recovery demo](https://voicedesk-h31g.onrender.com/agent/recovery).
